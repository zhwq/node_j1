package org.ibase.oo.dataType;

/**
 * Created by IntelliJ IDEA.
 * User: zhangwq
 * Date: 12-3-16
 * Time: 上午9:58
 * To change this template use File | Settings | File Templates.
 */
public class LangTest {
    
    public static void main( String args[] ) {
    
        //数组定义
        int data[] = { 1, 2, 4 };//JavaScript [ 1, 2, 4 ];

        // for loop
        for ( int i=0; i<data.length; i++ ) {
            System.out.println( "[" + i + "]--->" + data[ i ] );
        }

        // foreach
        for ( int item : data ) {//JavaScript for ( var i in data )
            System.out.println( item );
        }
    }
}
