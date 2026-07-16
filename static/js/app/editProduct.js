
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

function init_image() {
    
    const MIN = 5;
    const MAX = 7;
    
    updateCounter();
    
    
    $(document)
    .off("change", "#images")
    .on("change", "#images", function () {
        
        console.log("Choose clicked");
        
        let selected = Array.from(this.files);
        
        console.log(selected);
        
        if ($("#gallery .image-card").length + selected.length > MAX) {
            
            alert("Maximum 7 images allowed.");
            
            this.value = "";
            return;
        }
        
        selected.forEach(function (file) {
            
            if (!file.type.startsWith("image/"))
                return;
            
            let reader = new FileReader();
            
            reader.onload = function (e) {
                
                $("#gallery").append(`
                        <div class="image-card">
                            <button class="remove-btn" type="button">&times;</button>
                            <img src="${e.target.result}">
                        </div>
                    `);
                    
                    updateCounter();
                    
                };
                
                reader.readAsDataURL(file);
                
            });
            
            this.value = "";
            
        });
        
        
        
        $(document)
        .off("click", ".remove-btn")
        .on("click", ".remove-btn", function () {
            
            let card = $(this).closest(".image-card");
            let image = card.data("image");
            
            console.log("Deleting:", image);
            
            $.post("/api/v1/image/del", {
                uuid : $("#uuid").data("uuid"),
                image: image
            })
            .done(function () {
                
                let currentMain = $("#imageHolder").attr("src");
                
                // Remove the deleted thumbnail
                card.remove();
                
                // If the deleted image was the main image
                if (currentMain === "/static/" + image) {
                    
                    let next = $("#gallery .image-card img").first();
                    
                    if (next.length) {
                        $("#imageHolder").attr("src", next.attr("src"));
                    } else {
                        // No images left
                        $("#imageHolder").attr("src", "/static/images/no-image.png");
                        // or
                        // $("#imageHolder").attr("src", "");
                    }
                }
                
                updateCounter();
                
            })
            .fail(function (xhr,response) {
                showToast(response , "error");
                
            });
            
        });
        
        
        $(document)
        .off("dragover", "#dropArea")
        .on("dragover", "#dropArea", function (e) {
            
            e.preventDefault();
            
            $(this).addClass("dragging");
            
            console.log("Dragging");
            
        });
        
        
        $(document)
        .off("dragleave", "#dropArea")
        .on("dragleave", "#dropArea", function () {
            
            $(this).removeClass("dragging");
            
        });
        
        
        
        $(document)
        .off("drop", "#dropArea")
        .on("drop", "#dropArea", function (e) {
            
            e.preventDefault();
            
            $(this).removeClass("dragging");
            
            console.log("Dropped");
            
            let dropped = Array.from(e.originalEvent.dataTransfer.files);
            
            console.log(dropped);
            
            if ($("#gallery .image-card").length + dropped.length > MAX) {
                
                alert("Maximum 7 images allowed.");
                
                return;
            }
            
            dropped.forEach(function (file) {
                
                if (!file.type.startsWith("image/"))
                    return;
                
                let reader = new FileReader();
                
                reader.onload = function (e) {
                    
                    $("#gallery").append(`
                        <div class="image-card">
                            <button class="remove-btn" type="button">&times;</button>
                            <img src="${e.target.result}">
                        </div>
                    `);
                        
                        updateCounter();
                        
                    };
                    
                    reader.readAsDataURL(file);
                    
                });
                
            });
            
            
            
            function updateCounter() {
                
                let count = $("#gallery .image-card").length;
                
                console.log("Image Count :", count);
                
                if (count < MIN) {
                    
                    $("#imageCount")
                    .text(count + " / " + MIN + " Minimum Required")
                    .css("color", "#ff9800");
                    
                } else {
                    
                    $("#imageCount")
                    .text(count + " / " + MAX + " Images")
                    .css("color", "#4caf50");
                    
                }
                
                if (count >= MAX) {
                    
                    $("#dropArea").css("pointer-events", "none").css("opacity", ".5");
                    
                } else {
                    
                    $("#dropArea").css("pointer-events", "auto").css("opacity", "1");
                    
                }
                
            }
            
        }
        
        function getImg(id) {
            $.get("/api/v1/dialog/get/images", {
                uuid: $("#uuid").data("uuid"),
            })
            .done(function (data) {
                const dialog = new Dialog({
                    title: 'Product Images',
                    content: data,
                    size: "xl"
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
            })
            .fail(function (xhr) {
                showToast(xhr.responseJSON?.error || "Something went wrong.", "error");
            });
            
            init_image()
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
        
        
        