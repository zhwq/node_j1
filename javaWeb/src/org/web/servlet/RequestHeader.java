package org.web.servlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;

public class RequestHeader extends HttpServlet {

    //上下文参数
    private String contextParam = null;
    @Override
    public void init() {
        //context-param 通过ServletContext 获取
        ServletContext servletContext = super.getServletContext();
        contextParam = servletContext.getInitParameter("contextParam");
        System.out.println( contextParam );
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        this.process(request,response);
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        this.process(request,response);
    }
    //处理get/post请求
    private void process(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //上下文
        String contextPath = request.getContextPath();
        //请求头
        /*
            host
            connection
            user-agent
            accept
            accept-encoding
            accept-language
            accept-charset
            cookie
            //缓存
            Cache-Control
            Pragma
         */
        Enumeration<String> enumHeaderNames = (Enumeration<String>)request.getHeaderNames();
        while ( enumHeaderNames.hasMoreElements() ) {
            String headerKey = enumHeaderNames.nextElement();
            String headerVal = request.getHeader( headerKey );
            //项控制台输出信息
            System.out.println( headerKey + "--->" + headerVal );
        }
        //请求方式;get/post;
        String requestMode = request.getMethod();
        System.out.println( "请求方式-->" + requestMode);
       
    }
}