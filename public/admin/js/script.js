// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");

if (buttonsStatus.length > 0) {
  const url = new URL(window.location.href);
  buttonsStatus.forEach((button) => {
    button.addEventListener("click", (e) => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });
  });
}
// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
  const url = new URL(window.location.href);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    let keyword = event.target[0].value;
    if (keyword.trim()) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");

if (buttonsPagination.length > 0) {
  const url = new URL(window.location.href);

  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const newPage = button.getAttribute("button-pagination");

      url.searchParams.set("page", newPage);

      window.location.href = url.href;
    });
  });
}
// End Pagination

// Button Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("[form-change-status]");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const statusChange = statusCurrent == "active" ? "inactive" : "active";
      const action = `${path}/${statusChange}/${id}?_method=PATCH`;

      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
// End Button Change Status

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");

if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector('input[name="checkall"]');
  const inputsId = checkboxMulti.querySelectorAll('input[name="id"]');
  inputCheckAll?.addEventListener("change", () => {
    inputsId.forEach((input) => {
      input.checked = inputCheckAll.checked;
    });
  });

  inputsId?.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        'input[name="id"]:checked'
      ).length;

      if (countChecked === inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// End Checkbox Multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");

formChangeMulti?.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputsChecked = checkboxMulti.querySelectorAll(
    'input[name="id"]:checked'
  );
  if (inputsChecked.length > 0) {
    const ids = [];
    const inputIds = formChangeMulti.querySelector('[name="ids"]');
    const type = event.target.elements.type.value;

    if (type == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
      if (!isConfirm) return;
    }

    if (type == "delete-force") {
      const isConfirm = confirm(
        "Bạn có chắc muốn xóa vĩnh viễn những bản ghi này?"
      );
      if (!isConfirm) return;
    }

    inputsChecked?.forEach((input) => {
      const id = input.value;
      if (type == "change-position") {
        const position = input
          .closest("tr")
          .querySelector('input[name="position"]').value;

        ids.push(`${id}-${position}`);
      } else {
        ids.push(id);
      }
    });

    inputIds.value = ids.join(", ");

    formChangeMulti.submit();
  } else {
    alert("Vui lòng chọn ít nhất 1 bản ghi!");
  }
});
// End Form Change Multi

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("[form-delete-item]");
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach((button) => {
    button.addEventListener("click", (event) => {
      const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;

        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
// End Delete Item

// Resore Item
const buttonsRestore = document.querySelectorAll("[button-restore]");
if (buttonsRestore.length > 0) {
  const formRestoreItem = document.querySelector("[form-restore-item]");
  const path = formRestoreItem.getAttribute("data-path");

  buttonsRestore.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = button.getAttribute("data-id");
      const action = `${path}/${id}?_method=PATCH`;

      formRestoreItem.action = action;
      formRestoreItem.submit();
    });
  });
}
// End Restore Item

// Delete Force Item
const buttonsDeleteForce = document.querySelectorAll("[button-delete-force]");
if (buttonsDeleteForce.length > 0) {
  const formDeleteForce = document.querySelector("[form-delete-force]");
  const path = formDeleteForce.getAttribute("data-path");

  buttonsDeleteForce.forEach((button) => {
    button.addEventListener("click", (event) => {
      const isConfirm = confirm("Bạn có chắc muốn xóa vĩnh viễn bản ghi này?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;

        formDeleteForce.action = action;
        formDeleteForce.submit();
      }
    });
  });
}
// End Delete Force Item

// Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = showAlert.getAttribute("data-time");
  const closeAlert = showAlert.querySelector("[close-alert]");

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
// End Alert

// Preview Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadInputImage = uploadImage.querySelector("[upload-image-input]");
  const uploadPreviewImage = uploadImage.querySelector(
    "[upload-image-preview]"
  );

  uploadInputImage.onchange = (event) => {
    const [file] = uploadInputImage.files;
    if (file) {
      uploadPreviewImage.src = URL.createObjectURL(file);
    }
  };
}
// End Preview Image
