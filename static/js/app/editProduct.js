

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

function setPrice(){
    
    const content = `
    <div class="input-group mb-3">
        <button class="btn btn-outline-primary mb-0" id="minus" type="button">-</button>
        <button class="btn btn-outline-primary mb-0" id="plus" type="button">+</button>
        <input type="text" class="form-control text-center" id="price" value="89" >
    </div>
 
    `
    const dialog = new Dialog({
        title: "Price",
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
                const price = modal.find("#price").val();
                $.post("/api/v1/set-price", {
                    uuid: $("#uuid").data("uuid"),
                    price: price
                })
                .done(function (data) {
                    showToast(data.success, "success");
                    $("#previewPrice").html(`${price}`);
                    
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
            let price = parseFloat($("#price").val()) || 0;
            $("#price").val((price + step).toFixed(2));
        });
        
        $("#minus").on("click", function () {
            let price = parseFloat($("#price").val()) || 0;
            $("#price").val(Math.max(0, price - step).toFixed(2));
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
        setPrice()
    }
});


