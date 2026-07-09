
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
function setPriceAndQuantity(id,text=false){
    
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
                    $("#preview"+is_id).html(`${value}`);
                    
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
        input.setSelectionRange(0, 0); // Cursor at the beginning
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



$("#EditProductForm").on("click", ".edit-icon", function () {
    console.log($(this).attr("id"));
    var status = $(this).attr("id")
    
    switch (status) {
        case "previewStockBadge":
        setBadges("stock")
        break;
        case "previewPrices":
        setPriceAndQuantity("price")
        break;
        case "previewQtys":
        setPriceAndQuantity("quantity")
        break;
        case "previewTag":
        setBadges("tag")
        break;
        case "previewDisBadge":
        setBadges("dis")
        break;
        case "previewName":
        setPriceAndQuantity("name",true)
        break;
        case "previewDescription":
        setPriceAndQuantity("description",true)
        break;
    }
});


