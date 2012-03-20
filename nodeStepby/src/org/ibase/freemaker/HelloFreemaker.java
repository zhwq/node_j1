package org.ibase.freemaker;


import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class HelloFreemaker {

    private static final String DIR_FREEMAKER =
            "C:\\Users\\zhangwq\\Desktop\\ibase\\web\\freemaker";
    public static void main( String args[] ) throws Exception {

        //配置
        Configuration cfg = new Configuration();
        cfg.setDirectoryForTemplateLoading( new File( DIR_FREEMAKER ));
        cfg.setObjectWrapper( new DefaultObjectWrapper());

        //获取、创建模板
        Template template = cfg.getTemplate( "hello.ftl" );

        Map root = new HashMap();

    }
}
