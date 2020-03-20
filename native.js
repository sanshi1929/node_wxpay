let MD5 = require("md5");
xml2js = require("xml2js");
var request = require("request");
const random = require("string-random");

ip = "127.0.0.1"; //ip 주소
url = "https://api.mch.weixin.qq.com/pay/unifiedorder"; // 요청 주소
appid = "wx8397f8696b538317"; //appid
mch_id = "1473426802"; //mch_id
notify_url = "http://www.baidu.com"; //반환 주소
out_trade_no = "293291231828"; // 주문번호
total_fee = "100"; // 금액
body = "iphone"; //상품
trade_type = "NATIVE"; // JSAPI--공중계정、NATIVE--QR코드、APP--app지불
nonce_str = random(16); // 32bit이하
stringA = `appid=${appid}&body=${body}&mch_id=${mch_id}&nonce_str=${nonce_str}&notify_url=${notify_url}&out_trade_no=${out_trade_no}&spbill_create_ip=${ip}&total_fee=${total_fee}&trade_type=${trade_type}`;
stringSignTemp = stringA + "&key=T6m9iK73b0kn9g5v426MKfHQH7X8rKwb"; //key는 결제 키
sign = MD5(stringSignTemp).toUpperCase(); //MD5 sign
//xml 로 변환
let formData = "<xml>";
formData += "<appid>" + appid + "</appid>";
formData += "<body>" + body + "</body>";
formData += "<mch_id>" + mch_id + "</mch_id>";
formData += "<nonce_str>" + nonce_str + "</nonce_str>";
formData += "<notify_url>" + notify_url + "</notify_url>";
formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
formData += "<total_fee>" + total_fee + "</total_fee>";
formData += "<spbill_create_ip>" + ip + "</spbill_create_ip>";
formData += "<trade_type>NATIVE</trade_type>";
formData += "<sign>" + sign + "</sign>";
formData += "</xml>";

//요청

request(
  {
    url: url,
    method: "POST",
    body: formData
  },
  function(error, response, body) {
    var formMessage = function(result) {
      var message = {};
      if (typeof result === "object") {
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
          var item = result[keys[i]];
          var key = keys[i];
          if (!(item instanceof Array) || item.length === 0) {
            continue;
          }
          if (item.length === 1) {
            var val = item[0];
            if (typeof val === "object") {
              message[key] = formMessage(val);
            } else {
              message[key] = (val || "").trim();
            }
          } else {
            message[key] = [];
            for (var j = 0, k = item.length; j < k; j++) {
              message[key].push(formMessage(itemp[j]));
            }
          }
        }
      }
      return message;
    };
    if (!error && response.statusCode == 200) {
      // xml->json
      xml2js.parseString(body, function(err, json) {
        if (err) {
          new Error("解析xml报错");
        } else {
          var result = formMessage(json.xml); // json로 변환
          console.log(result);
        }
      });
    }
  }
);
