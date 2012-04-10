package org.se.file;


import java.io.*;

public class FileReader01 {

    public static void main(String args[]) throws FileNotFoundException, IOException {
        //1.文件实例
        File file = new File("D:\\github\\node_j1\\javaWeb\\assests\\file\\reader01.txt");
        //2.读取操作
        FileReader fileReader = new FileReader(file);
        BufferedReader bufferedReader = new BufferedReader(fileReader);
        String buffer = null;
        while ( (buffer = bufferedReader.readLine()) != null ) {
            System.out.println(buffer);
        }
        bufferedReader.close();
        fileReader.close();
    }
}
