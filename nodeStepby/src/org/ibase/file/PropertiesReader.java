package org.ibase.file;

import java.io.InputStream;
import java.util.Enumeration;
import java.util.Properties;

//读取类路径下的properties文件
public class PropertiesReader {

    public static void main(String[] args) throws Exception {
        String resPath = "config.properties";
        InputStream inputStream = PropertiesReader.class.getClassLoader().getResourceAsStream( resPath );
        Properties properties = new Properties();
        properties.load( inputStream );
        Enumeration<String> keyEnum = (Enumeration<String>) properties.propertyNames();
        while ( keyEnum.hasMoreElements() ) {
            String key = (String) keyEnum.nextElement();
            String val = (String) properties.get( key );
            System.out.println( key + "-->" + val );
        }
    }

}
