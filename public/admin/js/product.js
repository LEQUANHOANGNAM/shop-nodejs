// button change status
const buttonChange=document.querySelectorAll("[button-change-status]");
if(buttonChange.length>0){
    const formChanges= document.querySelector("#form-change-status");
    const path=formChanges.getAttribute("path")
    buttonChange.forEach(button => {
        button.addEventListener("click", ()=>{
            const statusCurrent=button.getAttribute ("data-status");
            const id = button.getAttribute ("data-id");

            let statusChange = statusCurrent == "active" ? "inactive":"active";
            const action= path + `/${statusChange}/${id}?_method=PATCH`;
            formChanges.action=action;
            formChanges.submit();
            // console.log(action);


            // console.log(statusChange);
        });
    });
}
// end button change status

// DELETE
const buttonsDelete= document.querySelectorAll("[button-delete]")
if(buttonsDelete.length>0){
    const formDeleteItem= document.querySelector("#form-delete-item");
    const path=formDeleteItem.getAttribute("path");
    buttonsDelete.forEach(button=>{
        button.addEventListener("click",()=>{
            const isConfirm=confirm("bạn có muốn chắc chắn muốn xóa sản phẩm này không");

            if(isConfirm){
                const id= button.getAttribute("data-item");
                const action= `${path}/${id}?_method=DELETE`;
                formDeleteItem.action=action;

                formDeleteItem.submit();
            }
        });
    });
}
// END DELETE

// phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const roles = [];

    const listElementRoleId = tablePermissions.querySelectorAll("[role-id]");
    for (const element of listElementRoleId) {
      const roleId = element.getAttribute("role-id");
      const role = {
        id: roleId,
        permissions: []
      };

      const listInputChecked = tablePermissions.querySelectorAll(`input[data-id="${roleId}"]:checked`);

      listInputChecked.forEach(input => {
        const dataName = input.getAttribute("data-name");
        role.permissions.push(dataName);
      });

      roles.push(role);
    }

    const path = buttonSubmit.getAttribute("button-submit");

    fetch(path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roles)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
  });
}

//hết phân quyền