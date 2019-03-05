declare namespace BusinessStore{
  namespace operation {
    var initData: Object<any>;
    var searchData: Object<any>;
    function mergeSearchData(params: [any]) : Promise<any>;
  }
}