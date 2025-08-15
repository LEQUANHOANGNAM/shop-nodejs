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

