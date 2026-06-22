$(document).ready(function () {
  let selectedImages = [];

  function updatePreview() {
    $("#previewName").text($("#productName").val() || "Product Name");
    $("#previewDesc").text($("#description").val() || "Product description preview...");
    $("#previewPrice").text($("#price").val() || "0");
    $("#previewQty").text($("#quantity").val() || "0");
    $("#previewCategory").text($("#category").val() || "Fashion");
    $("#previewSku").text($("#sku").val() || "SKU-001");
    $("#previewOldPrice").text($("#oldPrice").val() || "0");
    $("#previewDiscount").text($("#discount").val() || "10");

  }

  $("#productName, #description, #price, #quantity , #preview-gallery").on("input", updatePreview);

 

  $("#dropArea").on("click", function () {
    $("#images").click();
  });

  $("#images").on("change", function () {
    handleFiles(this.files);
    $(this).val("");
  });

  $("#dropArea").on("dragover", function (e) {
    e.preventDefault();
    $(this).addClass("active");
  });

  $("#dropArea").on("dragleave", function () {
    $(this).removeClass("active");
  });

  $("#dropArea").on("drop", function (e) {
    e.preventDefault();
    $(this).removeClass("active");

    const files = e.originalEvent.dataTransfer.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    const newFiles = Array.from(files);

    if (selectedImages.length + newFiles.length > 7) {
      $("#imageMsg").text("Maximum 7 images only");
      return;
    }

    newFiles.forEach(function (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }

      selectedImages.push(file);

      const reader = new FileReader();

      reader.onload = function (e) {
        if ($(".previewImage img").length) {
            $(".previewImage img").attr("src", e.target.result);
        } else {
            $(".previewImage").append(`
                <img src="${e.target.result}">
            `);
        }
        $("#gallery").append(`
          <div class="image-card">
            <button type="button" class="remove-btn">×</button>
            <img src="${e.target.result}">
          </div>
        `);
        
      };

      reader.readAsDataURL(file);
      
    });

    $("#imageMsg").text("");
  }

 $("#gallery").on("click", ".remove-btn", function () {

    const card = $(this).closest(".image-card");
    const removedSrc = card.find("img").attr("src");

    selectedImages.splice(card.index(), 1);

    card.remove();

    if ($(".previewImage img").attr("src") === removedSrc) {

        $(".previewImage img").attr(
            "src",
            $("#gallery .image-card img").first().attr("src")
            || "https://via.placeholder.com/300x300?text=No+Image"
        );
    }
});

  $("#addVariant").on("click", function () {
    $("#variantBox").append(`
      <div class="row variant-row">
        <div class="col-md-3 mb-3">
          <input type="text" class="form-control color" placeholder="Color">
        </div>

        <div class="col-md-3 mb-3">
          <input type="text" class="form-control size" placeholder="Size">
        </div>

        <div class="col-md-3 mb-3">
          <input type="number" class="form-control variant-price" placeholder="Price">
        </div>

        <div class="col-md-3 mb-3">
          <button type="button" class="btn bg-gradient-danger removeVariant w-100">
            Remove
          </button>
        </div>
      </div>
    `);
  });

  $("#variantBox").on("click", ".removeVariant", function () {
    if ($("#variantBox .variant-row").length > 1) {
        $(this).closest(".variant-row").remove();
    }
    
  });

  $("#productForm").on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", $("#productName").val());
    formData.append("description", $("#description").val());
    formData.append("price", $("#price").val());
    formData.append("quantity", $("#quantity").val());

    selectedImages.forEach(function (file) {
      formData.append("images[]", file);
    });

    const variants = [];

    $(".variant-row").each(function () {
      variants.push({
        color: $(this).find(".color").val(),
        size: $(this).find(".size").val(),
        price: $(this).find(".variant-price").val()
      });
    });

    formData.append("variants", JSON.stringify(variants));

    $.ajax({
      url: "/add-product",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        console.log(data);
        alert("Product saved successfully");
      },
      error: function (err) {
        console.error(err);
        alert("Something went wrong");
      }
    });
  });
});