package org.ibase.ajax;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class AjaxServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //设置编码
        request.setCharacterEncoding("utf-8");
        //response.setContentType("text/xml;charset=utf-8");
        response.setContentType("text/json;charset=utf-8");
        //接收的参数
        String id = request.getParameter("id");
        String limit = request.getParameter("limit");
        //输出的数据
        //String outXML = "<root><id>" + id + "</id><limit>" + limit + "</limit></root>";
        //String outJSON = "({id:"+id+",limit:"+limit+"})";
        String outJSON = "{id:"+id+",limit:"+limit+"}";
        //输出
        PrintWriter printWriter =  response.getWriter();
        printWriter.print(outJSON);
        printWriter.flush();
        printWriter.close();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }
}
