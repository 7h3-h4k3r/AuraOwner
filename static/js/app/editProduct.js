
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

if (is_id === "Tag") {

    const tags = [];
    var  val = 0
    modal.find("#tagContainer span").each(function () {
        tags.push({
            val :{
                text: $(this).text().trim(),
                color: $(this).attr("class").split(" ")[0],
            },
            
            
        });
        val = val +1
    });
    console.log(tags)
    $.post("/api/v1/set-badge" + is_id, {
        uuid: $("#uuid").data("uuid"),
        tags: JSON.stringify(tags)
    })
    .done(function (data) {
        showToast(data.success, "success");
    })
    .fail(function (xhr) {
        showToast(xhr.responseJSON?.error || "Something went wrong.", "error");
    });

} else {

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
            .removeClass(colors)
            .addClass(color)
            .html(`${icon} ${text} <i class="fas fa-pen ms-1"></i>`);
    })
    .fail(function (xhr) {
        showToast(xhr.responseJSON?.error || "Something went wrong.", "error");
    });

}
}

// Register ONCE
$(document).on("click", "#addTag", function () {

    const text = $("#tagText").val().trim();
    const color = $("#tagColor").val();

    if (!text) {
        showToast("Please enter a tag.","warning");
    }

    $("#tagContainer").append(`
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="${color} fw-bold">${text}</span>
            <button type="button" class="btn btn-link text-danger p-0 delete-tag">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `);

    $("#tagText").val("");
    $("#tagColor").prop("selectedIndex", 0);
});

$(document).on("click", ".delete-tag", function () {

    const row = $(this).closest(".d-flex");
    const id = row.find("span").attr("id")
    console.log(id)
    $.post("/api/v1/del-badgetag", {
        uuid: $("#uuid").data("uuid"),
        id: id
    })
    .done(function (response) {
        row.remove();
        removePreviewTag(id)
        showToast("Tag deleted successfully","success");
    })
    .fail(function (xhr) {
        showToast("Failed to delete tag!","error");
    });

});

function setPriceAndQuantity(id){
    
    const is_id = toUpper(id)
    const getvl = $("#preview"+is_id).text()
    console.log(getvl)
    const content = `
    <div class="input-group mb-3">
        <button class="btn btn-outline-primary mb-0" id="minus" type="button">-</button>
        <button class="btn btn-outline-primary mb-0" id="plus" type="button">+</button>
        <input type="text" class="form-control text-center" id="${is_id}" value="${getvl}" >
    </div>
 
    `
    
    const dialog = new Dialog({
        title: is_id,
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
        break
    }
});


