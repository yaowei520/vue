import jsonp from "common/js/jsonp.js"
import {commonParams,options} from "./config.js"
export default function getRecommend(){
  let data=Object.assign({},commonParams);
  let url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg"
  return jsonp(url,data,options)
}