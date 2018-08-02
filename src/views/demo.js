import 'babel-polyfill'
import 'bootstrap/dist/js/bootstrap.js'
import 'zTree'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'zTree/css/zTreeStyle/zTreeStyle.css'
import {ajaxData} from '@/assets/js/common'
let obj = {
  url: '/category/listCategorys'
}
ajaxData(obj)
  .then(response => {
    console.log(response)
  })
let zTreeObj
const setting = {}
const zNodes = [
  {
    name:"test1",
    open:true,
    children:[
      {name:"test1_1"}, {name:"test1_2"}
    ]
  },
  {
    name:"test2",
    open:true,
    children:[
     {name:"test2_1"}, {name:"test2_2"}
    ]
  }
];
$(document).ready(function () {
  zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
})

