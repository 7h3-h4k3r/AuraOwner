function addEditIcon(is_this){
    is_this.append(
        '<i class="fas fa-pen ms-1" style="cursor:pointer;"></i>'
    )
}

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
    console.log('price setting')
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
