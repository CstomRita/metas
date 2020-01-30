package cn.cst.metasweb.utils.code;

/**
 * @ Author     ：ChangSiteng
 * @ Date       ：Created in 17:45 2020-01-27
 * @ Description：返回值 code和message
 * @ Modified By：
 * @Version: $
 */
public enum ResponseResutCodeEnum implements CodeEnum{

    SUCCESS(200,"success"),
    ERROR(400,"error in process");

    private Integer code;
    private String message;

    private ResponseResutCodeEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public Integer getCode() {
        return this.code;
    }

    @Override
    public String getMessage() {
        return this.message;
    }}
