module.exports=(objectPagination,query,countProduct)=>{
    if(query.page){
        objectPagination.currentPage= parseInt(query.page,10)||1;
    }
    
    objectPagination.currentPage = Math.max(1, objectPagination.currentPage);
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;

    return objectPagination;
    
};