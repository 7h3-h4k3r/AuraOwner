function showToast(message, type = "success") {

    let toastBox = document.getElementById("toastBox");

    // Create container if not exists
    if (!toastBox) {
        toastBox = document.createElement("div");
        toastBox.id = "toastBox";

        toastBox.style.position = "fixed";
        toastBox.style.top = "20px";
        toastBox.style.right = "20px";
        toastBox.style.zIndex = "9999";

        document.body.appendChild(toastBox);
    }

    const toast = document.createElement("div");

    toast.className = `soft-toast ${type}`;

    toast.innerHTML = `
        <span>${getToastIcon(type)}</span>
        <span>${message}</span>
    `;

    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.remove();

        // Remove empty container
        if (toastBox.children.length === 0) {
            toastBox.remove();
        }

    }, 3000);
}

function getToastIcon(type) {
    switch (type) {
        case "success": return "✅";
        case "error": return "❌";
        case "warning": return "⚠️";
        default: return "ℹ️";
    }
}