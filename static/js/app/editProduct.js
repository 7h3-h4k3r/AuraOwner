
function toUpper(id){
    return id.charAt(0).toUpperCase() + id.slice(1)
}

function removePreviewTag(id) {
    
    $("#" + id).remove();
}

function setBadges(id) {
    const is_id = toUpper(id);
    
    $.get("/api/v1/dialog/get/badges-" + is_id, {
        uuid: $("#uuid").data("uuid")
    }, function (data) {
        
        new Dialog({
            title: `${is_id} Badge`,
            content: data,
            size: "lm"
        })
        .setButtons([
            {
                text: "Cancel",
                class: "btn-secondary",
                dismiss: true
            },
            {
                text: "Submit",
                class: "btn-primary",
                onClick: function (e, modal) {
                    saveBadge(is_id, modal);
                    bootstrap.Modal.getInstance(modal[0]).hide();
                }
            }
        ])
        .render();
    });
}

function saveBadge(is_id, modal) {
    
    const badge = modal.find("input[name='badge']:checked");
    
    const text = badge.val();
    const color = badge.data("color");
    const icon = badge.data("icon");
    
    $.post("/api/v1/set-badge" + is_id, {
        uuid: $("#uuid").data("uuid"),
        badge: JSON.stringify({
            text: icon + text,
            color: color
        })
    })
    .done(function (data) {
        showToast(data.success, "success");
        
        $("#preview" + is_id + "Badge")
        .addClass(color)
        .html(`${icon} ${text} <i class="fas fa-pen ms-1"></i>`);
    })
    .fail(function (xhr) {
        showToast(xhr.responseJSON?.error || "Something went wrong.", "error");
    });
    
}


function getContent(id, text = false) {
    
    const is_id = toUpper(id);
    const getvl = $("#preview" + is_id).text();
    
    const content = `
    <div class="input-group mb-3">
    
        ${!text ? `
            <button class="btn btn-outline-primary mb-0" id="minus" type="button">-</button>
        ` : ""}
        ${!text ? `
            <button class="btn btn-outline-primary mb-0" id="plus" type="button">+</button>
        ` : ""}
        ${!text ? "" : `<button
        class="btn btn-outline-primary mb-0"
        type="button"
        tabindex="-1"
        disabled>
        Edit's
    </button>`}
        
         <input
            type="${text ? 'text' : 'number'}"
            class="form-control ${text ? 'text-start' : 'text-center'}"
            id="${is_id}"
            value="${getvl}">
    
    
    
    </div>
    `;
    
    return content;
}
function setvar(id,text=false){
    
    const is_id = toUpper(id)
    const getvl = $("#preview"+is_id).text()
    
    const content = getContent(id,text)
    
    const dialog = new Dialog({
        title: 'Product ' + is_id,
        content: content,
        size: "lm"
    })
    .setButtons([
        {
            text: "Cancel",
            class: "btn-secondary",
            dismiss: true
        },
        {
            text: "Submit",
            class: "btn-primary",
            onClick: (e, modal) => {
                const value = modal.find("#" + is_id).val();
                $.post("/api/v1/set-"+is_id, {
                    uuid: $("#uuid").data("uuid"),
                    value: value
                })
                .done(function (data) {
                    showToast(data.success, "success");
                    console.log("#preview"+is_id)
                    $(".preview"+is_id).html(`${value}`);
                    
                    
                })
                .fail(function (xhr) {
                    
                    const response = xhr.responseJSON;
                    
                    if (response && response.error) {
                        showToast(response.error, "error");
                    } else {
                        showToast("Something went wrong.", "error");
                    }
                }); 
                
                const bsModal = bootstrap.Modal.getInstance(modal[0]);
                bsModal.hide();
            }
            
        }
    ])
    .render();
    
    setTimeout(() => {
        const input = document.getElementById(is_id);
        input.focus();
        
        if (text) {
            input.setSelectionRange(0, 0); 
        }
    }, 100);
    
    setTimeout(() => {
        const step = 1;
        
        $("#plus").on("click", function () {
            let plus_v = parseFloat($("#"+is_id).val()) || 0;
            $("#"+is_id).val((plus_v + step).toFixed(2));
        });
        
        $("#minus").on("click", function () {
            let minus_v = parseFloat($("#"+is_id).val()) || 0;
            $("#"+is_id).val(Math.max(0, minus_v - step).toFixed(2));
        });
    }, 0);
}

function setText(id){
    const id_of = toUpper(id)
    $.post("/api/v1/set/" + is_id, {
        uuid: $("#uuid").data("uuid"),
        badge: JSON.stringify({
            text: icon + text,
            color: color
        })
    })
    .done(function (data) {
        showToast(data.success, "success");
        
        $("#preview" + is_id + "Badge")
        .addClass(color)
        .html(`${icon} ${text} <i class="fas fa-pen ms-1"></i>`);
    })
    .fail(function (xhr) {
        showToast(xhr.responseJSON?.error || "Something went wrong.", "error");
    });
}

const ProductManager = {
    
    deletedImage: [],    
    selectedImages: [],  
    
    
    init() {
        this.bindEvents();
    },
    
    bindEvents() {
        
        $("#dropArea").on("click", () => {
            $("#images").click();
        });
        
        $("#images").on("change", (e) => {
            this.handleFiles(e.target.files);
            $("#images").val("");
        });
        
        $("#gallery").on("click", ".remove-btn", (e) => {
            const imageCard = $(e.currentTarget).closest(".image-card")
            
            if (imageCard.hasClass("existing")){
                const imagePath = imageCard.data('image')
                this.deletedImage.push(imagePath);
                this.removeImage(e);
            }else{
                
                this.removeImage(e);
            }
        
        });
        
        $("#saveImagesBtn").on("click", (e) => {
            this.saveImages(e);
        });
        
    },
    
    
    handleFiles(files) {
        
        const newFiles = Array.from(files);
        
        if (this.selectedImages.length + this.getExistingImages() + newFiles.length > 7) {
            showToast("Maximum 7 images only.", "warning");
            return;
        }
        
        newFiles.forEach(file => {
            
            if (!file.type.startsWith("image/"))
                return;
            
            this.selectedImages.push(file);
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                
                if ($(".previewImage img").length === 0) {
                    $(".previewImage").html(`<img src="${e.target.result}">`);
                }
                
                $("#gallery").append(`
                    <div class="image-card new">
                        <button type="button" class="remove-btn">×</button>
                        <img src="${e.target.result}">
                    </div>
                `);
                    
                };
                
                reader.readAsDataURL(file);
                
            });
            
        },
        
        removeImage(e) {
            
            const card = $(e.target).closest(".image-card");
            
            card.remove()
            
        },
        
        getExistingImages() {
            return $("#gallery .image-card.existing").length
        },
        
        saveImages(e) {
            
            e.preventDefault();
            const ex_lenght = this.getExistingImages();
            const total = ex_lenght  + this.selectedImages.length;
            
            console.log("Total images to save:", total);
            if (total < 5) {
                showToast("Please select at least five images.", "error");
                return;
            }

            
            const formData = new FormData();
            
            formData.append(
                "uuid",
                $("#uuid").data("uuid")
            );
            
            
            formData.append(
                "deletedImage",
                JSON.stringify(this.deletedImage)
            );
            
            
            this.selectedImages.forEach(file => {
                formData.append("images[]", file);
            });
            
            $.ajax({
                url: "/api/v1/set/images",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success(data) {
                    showToast(data.message, "success");
                },
                error(xhr) {
                    showToast(
                        xhr.responseJSON?.errors ||
                        "Something went wrong.",
                        "error"
                    );
                }
            });
        }
    };
    
    $(function () {
        ProductManager.init();
    });
    
    
    $("#edit-product-variants").on("click", ".btn-varient-delete", function () {
        const row = $(this).closest("tr");
        const uuid = $("#uuid").data("uuid");
        const variantId = $(this).attr("id");
        console.log("Deleting variant:", variantId, "for product UUID:", uuid);
        $.ajax({
            url: "/api/v1/delete/variant",
            type: "POST",
            data: {
                uuid: uuid,
                variant_id: variantId
            },
            success(data) {
                
                row.remove();
                showToast(data.message, "success");
                
            },
            error(xhr) {
                showToast(
                    xhr.responseJSON?.errors ||
                    "Something went wrong.",
                    "error"
                );
            }
        });
    });
    
    $("#add-variant-btn").on("click", function (e) {
        e.preventDefault();
        
        console.log("Opening Add Variant dialog...");
        dialog = new Dialog({
            title: "Add Variant",
            content: `
            <form id="addVariantForm">
                <div class="mb-3">
                    <label for="color" class="form-label">Color</label>
                    <input type="text" class="form-control color" id="color" required>
                </div>
                <div class="mb-3">
                    <label for="size" class="form-label">Size</label>
                    <input type="text" class="form-control size" id="size" required>
                </div>
                <div class="mb-3">
                    <label for="variant-price" class="form-label">Price</label>
                    <input type="number" step="0.01" class="form-control variant-price" id="variant-price" required>
                </div>
            </form>
        `,
            size: "md"
        })
        .setButtons([
            {
                text: "Cancel",
                class: "btn-secondary",
                dismiss: true
            },
            {
                text: "Submit",
                class: "btn-primary",
                onClick: function (e, modal) {
                    const form = modal.find("#addVariantForm");
                    if (form[0].checkValidity()) {
                        addVariant(form);
                        bootstrap.Modal.getInstance(modal[0]).hide();
                    } else {
                        form[0].reportValidity();
                    }
                }
            }
        ])
        .render();
    });
    
    function addVariant(form) {
        const uuid = $("#uuid").data("uuid");
        let variants = {};
        const color = form.find(".color").val();
        const size = form.find(".size").val();
        const price = form.find(".variant-price").val();
        const profitprice = $("#previewPrice").text();
        const id = crypto.randomUUID();
        variants[id] = {
            color: color,
            size: size,
            price: price
        };
        console.log("Adding variant for product UUID:", uuid);
        $.ajax({
            url: "/api/v1/add/variant",
            type: "POST",
            data: {
                uuid: uuid,
                variants: JSON.stringify(variants)
            },
            success(data) {
                const totalPrice = Number(price) + Number(profitprice);
                $("#edit-product-variants").append(`
                <tr class=variant-row-${id}">
                        
                        <td>
                            <div class="d-flex px-2 py-1">
                                
                                <div id="avatarLetter"
                                class="avatar avatar-sm me-3 bg-gradient-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold">
                                ${color.charAt(0).toUpperCase()}
                            </div>
                            
                            <div class="d-flex flex-column justify-content-center">
                                <h6 class="mb-0 text-sm previewName" id="previewName">${color.toUpperCase()}</h6>
                                
                            </div>
                            
                        </div>
                    </td>
                    
                    <td>
                        <p class="text-xs font-weight-bold mb-0 previewPrice">
                            ${size.charAt(0).toUpperCase()}
                        </p>
                        
                        <p class="text-xs text-secondary mb-0 ">
                            price: <span clas="previewQuantity">${price}</span>
                        </p>
                    </td>
                    
                    <td class="align-middle text-center text-sm">
                        
                        <p class="text-xs font-weight-bold mb-0 previewPrice">
                            ${totalPrice}
                        </p>
                        
                    </td>
                    
                    <td class="align-middle text-center">
                        <button type="button" id=${id} class="btn btn-link btn-varient-delete text-danger p-2" title="Delete">
                            <i class="fas fa-trash-alt text-lg"></i>
                        </button>
                    </td>
                    <th class="text-secondary opacity-7"></th>
                    
                    
                </tr>`);
                    showToast(data.message, "success");
                },
                
                error(xhr) {
                    showToast(
                        xhr.responseJSON?.errors ||
                        "Something went wrong.",
                        "error"
                    );
                }
            });
        }
        
        $("#EditProductForm").on("click", ".edit-icon", function () {
            console.log($(this).attr("id"));
            var status = $(this).attr("id")
            
            switch (status) {
                case "previewStockBadge":
                setBadges("stock")
                break;
                case "previewPrices":
                setvar("price")
                break;
                case "previewQtys":
                setvar("quantity")
                break;
                case "previewTag":
                setBadges("tag")
                break;
                case "previewDisBadge":
                setBadges("dis")
                break;
                case "previewName":
                setvar("name",true)
                break;
                case "previewDescription":
                setvar("description",true)
                break;
                case "imageHolder":
                console.log('image get')
                getImg($("#uuid"))
                break;
            }
        });
        
        
        