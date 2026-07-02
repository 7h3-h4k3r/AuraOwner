
function setData(product_list,del_state=false) {
  
  if (del_state === false){
    if (product_list.length===0){
        showToast("You have reached the end of the product list.", "info");
        return false
    }
    $("#set-product").empty();
  }

  
  $.each(product_list, function(index, product) {
    
    let badge
    
    let checked
    if (product.status=="true"){
      checked = 'checked'
      badge = '<span class="badge badge-sm bg-gradient-success">Active</span>'
    }else{
      checked = ' '
      badge = '<span class="badge badge-sm bg-gradient-secondary">Inactive</span>';
    }
    
    $("#set-product").append(`
            <tr>
      
                <td>
                    <div class="d-flex px-2 py-1">
      
                        <div>
                            <img
                                src="${'static/' +product.images?.[0] || ''}"
                                class="avatar avatar-sm me-3"
                                alt="${product.name}"
                            >
                        </div>
      
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${product.name}</h6>
                            <p class="text-xs text-secondary mb-0">
                                ${product.uuid}
                            </p>
                        </div>
      
                    </div>
                </td>
      
                <td>
                    <p class="text-xs font-weight-bold mb-0">
                        ₹${product.price}
                    </p>
      
                    <p class="text-xs text-secondary mb-0">
                        Qty: ${product.quantity}
                    </p>
                </td>
      
                <td class="align-middle text-center text-sm">
                    ${badge}
                </td>
                
                <td class="align-middle text-center">
      
                    <div class="d-flex justify-content-center align-items-center h-100">
      
                        <div class="form-check form-switch m-0">
      
                            <input
                                class="form-check-input product-status"
                                type="checkbox"
                                data-uuid="${product.uuid}"
                                ${checked}
                            >
      
                        </div>
      
                    </div>
      
                </td>
                 <td class="align-middle text-center">
                    <button type="button"
                            id="${product.uuid}"
                            class="btn btn-link btn-delete text-danger p-2"
                            title="Delete">
                        <i class="fas fa-trash-alt text-lg"></i>
                    </button>
                </td>
      
                <td class="align-middle">
                    <a
                        href="/product/${product.uuid}"
                        class="text-secondary font-weight-bold text-xs"
                    >
                        Edit
                    </a>
                </td>
      
            </tr>
        `);
    });
    
    return true
  }
  function scrollToInvalid() {
    const firstInvalid = $(".is-invalid").first();
    
    if (firstInvalid.length) {
      $("html, body").animate({
        scrollTop: firstInvalid.offset().top - 100
      }, 500);
      
      firstInvalid.focus();
    }
  }
  
  
  function validate() {
    let isValid = true;
    
    $(".required").each(function () {
      
      if ($(this).val().trim() === "") {
        $(this).addClass("is-invalid");
        isValid = false;
      } else {
        $(this).removeClass("is-invalid");
      }
      
    });
    
    return isValid;
  }
  
  function validate_form_data(formData) {
    
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    
    let obj;
    
    if (formData.get("name").trim().length < 3) {
      
      obj = $("#productName");
      showToast("Product name must be at least 3 characters.", "warning");
      
    } else if (formData.get("description").trim().length < 25) {
      
      obj = $("#description");
      showToast("Description must be at least 25 characters.", "warning");
      
    } else if (
      formData.get("price").trim().length < 1 ||
      isNaN(price) ||
      price <= 0
    ) {
      
      obj = $("#price");
      showToast("Please enter a valid product price.", "warning");
      
    } else if (
      formData.get("quantity").trim().length < 1 ||
      isNaN(quantity) ||
      quantity <= 0
    ) {
      
      obj = $("#quantity");
      showToast("Please enter a valid quantity.", "warning");
      
    } else {
      
      return 0;
    }
    
    return obj;
  }
  
  
  function validate_variant() {
    let invalidField = null;
    let variants = [];
    
    $(".variant-row").each(function () {
      
      const color = $(this).find(".color").val();
      const size = $(this).find(".size").val();
      const price = $(this).find(".variant-price").val();
      
      let row = $(this).index() + 1;
      
      if (color.trim().length < 3) {
        invalidField = $(this).find(".color");
        showToast(`Variant ${row}: Invalid color name.`, "warning");
        return false;
      }
      
      if (size.trim().length !== 1) {
        invalidField = $(this).find(".size");
        showToast(`Variant ${row}: Invalid size.`, "warning");
        return false;
      }
      
      if (price.trim().length < 3) {
        invalidField = $(this).find(".variant-price");
        showToast(`Variant ${row}: Invalid price.`, "warning");
        return false;
      }
      
      variants.push({
        color: color,
        size: size,
        price: price
      });
      
    });
    
    if (invalidField) {
      return {
        valid: false,
        field: invalidField
      };
    }
    
    return {
      valid: true,
      variants: variants
    };
  }
  
  function imageValidate(images) {
    
    if (images.length < 5){
      return false
    }
    return true
  }
  
  function focusErr(obj){
    obj.addClass("is-invalid")
    obj.siblings("div").hide();
    obj.focus()
  }
  
  
  function setProductToTable(uuid){
    $.post("/api/v1/set-product", { uuid: uuid }, function(response){
      $("#set-product").prepend(response);
      
      if ($("#set-product tr").length > 10) {
        $("#set-product tr:last").remove();
      }
    });
  }
  
  function send(formData){
    $.ajax({
      url: "/api/v1/add-product",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false
    })
    .done(function(response) {
      
      if(response.status === "success"){
        setProductToTable(response.uuid);
        showToast(response.message, "success");
        
      }else{
        showToast(response.message || "Something went wrong", "warning");
      }
      
      $("#productForm")[0].reset();
      selectedImages = [];
      $("#gallery").empty();
      $("#imageHolder").attr("src", "");
    })
    .fail(function(xhr) {
      let message = xhr.responseJSON?.message || "Server Error";
      showToast(message, "danger");
      console.error(xhr);
    });
  }
  $(document).ready(function () {
    let selectedImages = [];
    let list_page = 1
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
                  <input type="text" class="required form-control color" placeholder="Color">
                  <div class="invalid-feedback">
                  colour is required
                </div>
                </div>
                
                <div class="col-md-3 mb-3">
                  <input type="text" class="required form-control size" placeholder="Size">
                  <div class="invalid-feedback">
                size is required
              </div>
                </div>
                
                <div class="col-md-3 mb-3 ">
                  <input type="number" class="required form-control variant-price" placeholder="Price">
                  <div class="invalid-feedback">
                prize is required
              </div>
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
            
            if(!validate()){
              scrollToInvalid();
              return;
            }
            
            const formData = new FormData();
            formData.append("name", $("#productName").val());
            formData.append("description", $("#description").val());
            formData.append("price", $("#price").val());
            formData.append("quantity", $("#quantity").val());
            
            selectedImages.forEach(function (file) {
              formData.append("images[]", file);
            });
            
            obj = validate_form_data(formData)
            if (obj!=0){
              focusErr(obj)
              return;
            }
            
            const result  = validate_variant();
            if (!result.valid){
              focusErr(result.field)
              return;
            }
            formData.append("variants", JSON.stringify(result.variants));
            
            obj=  imageValidate(formData.getAll("images[]"))
            
            if(obj==false){
              $("#dropArea").addClass("required")
              showToast("Product images not Found","warning")
              scrollToInvalid()
              $("#dropArea").removeClass("required")
              return;
            }
            selectedImages =[]
            send(formData)
          });
          
          
          $("#prevBtn").on("click",function(){
            if (list_page <= 1){
              showToast("You have reached the end of the product list.", "info");
              return;
            }
            list_page -=1
            $.post("/api/v1/get-product", { page: list_page }, function(response){
              console.log(response.products)
              setData(response.products)
            })
          })
          $("#nextBtn").on("click",function(){
            
            list_page +=1
            $.post("/api/v1/get-product", { page: list_page }, function(response){
              console.log(response.products)
              if (setData(response.products) === false){
                list_page-=1
              }
            })
          })
          $("#set-product").on("change", ".product-status", function () {
            
            const checkbox = $(this);
            const status = checkbox.prop("checked");
            const uuid = checkbox.data("uuid");
            
            $.post("/api/v1/stock", {
              uuid: uuid,
              status: status
            }, function (response) {
              
              if (response.status) {
                
                showToast(response.message, "success");
                
                const badge = checkbox.closest("tr").find(".badge");
                
                if (status) {
                  badge
                  .removeClass("bg-gradient-secondary")
                  .addClass("bg-gradient-success")
                  .text("IN-Live");
                } else {
                  badge
                  .removeClass("bg-gradient-success")
                  .addClass("bg-gradient-secondary")
                  .text("NON-LIVE");
                }
                
              } else {
                showToast(response.errors, "warning");
              }
              
            });
            
          });
          
          $(".btn-delete").on("click", function () {
            
            let button = $(this);
            let product_id = button.attr("id");
            
            $.post("/api/v1/del/product", { uuid: product_id }, function (response) {
              
              if (!response.status) {
                showToast("Product delete failed", "warning");
                return;
              }
              
              showToast("Product deleted successfully", "success");
              
          
              button.closest("tr").remove();
              
              $.post("/api/v1/get-product", {
                page: list_page,
                del: true
              }, function (res) {
                
                if (res.products.length > 0) {
                  setData(res.products,true)
                }
                
              });
              
            });
            
          });
          
          
          
        });
        
        