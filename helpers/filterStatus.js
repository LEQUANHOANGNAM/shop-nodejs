module.exports= (query) => {
    let filterStatus=[
        {
            name:"Tất Cả",
            status:"",
            class:""
        },
        {
            name:"Hoạt Động",
            status:"active",
            class:""
        },
        {
            name:"Dừng Hoạt Động",
            status:"inactive",
            class:""
        }
    ]
    if (query.status) {
        const index = filterStatus.findIndex(item => item.class ==="");
        // console.log(query.status)
        if (index !== -1) {
            filterStatus[index].class = "active"; // Gán giá trị "active"
         } 
        //  else {
        //     console.log(`Không tìm thấy mục với class = ${query.status}`);
        // }
    } else {
        const index = filterStatus.findIndex(item => item.class === query.status);
        if (index !== -1) {
            filterStatus[index].class = "active"; // Gán giá trị "active"
        } 
        // else {
        //     console.log("Không tìm thấy mục với class trống.");
        // }
    }
    return filterStatus;

}