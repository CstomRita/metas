package cn.cst.metasweb.utils;

import cn.cst.metasweb.utils.code.ResponseResutCodeEnum;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 17:38 2020-01-27
 * @ Description：返回值，包括 data\code\message
 * @ Modified By：
 * @Version: $
 */
public class ResponseResult {

    private String message;
    private Integer Code;
    private Object data;

    //OK 响应成功，有返回数据Data
    public static ResponseResult success(Object data) {
        return new ResponseResult(data);
    }
    //响应成功，返回数据Data为null
    public static ResponseResult success() {
        return new ResponseResult(null);
    }

    public static ResponseResult error() {
        return new ResponseResult(ResponseResutCodeEnum.ERROR.getMessage(),
                ResponseResutCodeEnum.ERROR.getCode(),null);
    }

    private ResponseResult(String message, Integer code, Object data) {
        this.message = message;
        Code = code;
        this.data = data;
    }

    private ResponseResult(Object data) {
        this.data = data;
        this.Code = ResponseResutCodeEnum.SUCCESS.getCode();
        this.message = ResponseResutCodeEnum.SUCCESS.getMessage();
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getCode() {
        return Code;
    }

    public void setCode(Integer code) {
        Code = code;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

}
