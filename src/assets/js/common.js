export const ajaxData = function (obj) {
  console.log('obj:', obj)
  return new Promise((resolve, reject) => {
     $.ajax({
      url: obj.url,
      data: obj.data || {},
      dataType: obj.dataType || 'json',
      type: obj.type || 'get',
      success: function (data) {
        console.log(data);
      }
    })
  })
}