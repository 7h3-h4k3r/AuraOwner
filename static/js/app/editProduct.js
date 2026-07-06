

function setstockBadge(){
    $.get('/api/v1/dialog/get/badges',function(data){
        new Dialog({
            title: "Badge",
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
                text: "submit",
                class: "btn-primary",
                onClick: (e, modal) => {
                    const badge = modal.find("input[name='badge']:checked");
                    
                    const text = badge.val();
                    const color = badge.data("color");
                    const icon = badge.data("icon");
                    
                    const colors = "text-success text-danger text-warning text-primary text-info text-dark text-secondary";
                    
                    $.post("/api/v1/set-badge", {
                        uuid: $("#uuid").data("uuid"),
                        badge: icon + " " + text
                    })
                    .done(function (data) {
                        showToast(data.success, "success");
                        if(color){
                            $("#previewStockBadge")
                            .removeClass(colors)
                            .addClass(color)
                            .html(`${icon} ${text} <i class="fas fa-pen ms-1"></i>`);
                        }
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
    });
}

function setPriceAndQuantity(id){

    const is_id = id.charAt(0).toUpperCase() + id.slice(1)
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
        setstockBadge()
        
        case "previewPrices":
        setPriceAndQuantity("price")
    }
});


