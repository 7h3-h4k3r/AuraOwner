function addEditIcon(is_this){
    is_this.append(
        '<i class="fas fa-pen ms-1" style="cursor:pointer;"></i>'
    )
}

function stockBadge(){
    const content = `
<div class="d-flex flex-wrap gap-2">

    <input type="radio" class="btn-check" name="badge" id="none" value="None" checked>
    <label class="btn btn-outline-secondary" for="none">None</label>

    <input type="radio" class="btn-check" name="badge" id="inStock" value="In Stock">
    <label class="btn btn-outline-success" for="inStock">🟢 In Stock</label>

    <input type="radio" class="btn-check" name="badge" id="hotDeal" value="Hot Deal">
    <label class="btn btn-outline-danger" for="hotDeal">🔥 Hot Deal</label>

    <input type="radio" class="btn-check" name="badge" id="bestSeller" value="Best Seller">
    <label class="btn btn-outline-warning" for="bestSeller">⭐ Best Seller</label>

    <input type="radio" class="btn-check" name="badge" id="featured" value="Featured">
    <label class="btn btn-outline-primary" for="featured">💎 Featured</label>

    <input type="radio" class="btn-check" name="badge" id="newArrival" value="New Arrival">
    <label class="btn btn-outline-info" for="newArrival">🆕 New Arrival</label>

    <input type="radio" class="btn-check" name="badge" id="limited" value="Limited Stock">
    <label class="btn btn-outline-dark" for="limited">⚠️ Limited Stock</label>

    <input type="radio" class="btn-check" name="badge" id="sale" value="On Sale">
    <label class="btn btn-outline-danger" for="sale">🏷️ On Sale</label>

    <input type="radio" class="btn-check" name="badge" id="soldOut" value="Sold Out">
    <label class="btn btn-outline-secondary" for="soldOut">❌ Sold Out</label>

    <input type="radio" class="btn-check" name="badge" id="comingSoon" value="Coming Soon">
    <label class="btn btn-outline-primary" for="comingSoon">🚀 Coming Soon</label>

</div>;`
    new Dialog({
        title: "Badge",
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
            text: "submit",
            class: "btn-primary",
            onClick: (e, modal) => {
                const username = modal.find("input[name='badge']:checked").val();
                $("#previewStockBadge").text(username)
                addEditIcon($("#previewStockBadge"))
               const bsModal = bootstrap.Modal.getInstance(modal[0]);
    bsModal.hide();
            }
        }
    ])
    .render();
}

$("#EditProductForm").on("click", ".edit-icon", function () {
    console.log($(this).attr("id"));
    var status = $(this).attr("id")
    
    switch (status) {
        case "previewStockBadge":
        stockBadge()
    }
});
