package org.ibase.db;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class DataBaseConnection {
      //(1)lh db config
//    private static final String DB_URL = "jdbc:oracle:thin:@localhost:1521:ORCL9I";
//    private static final String DB_USERNAME = "jcs_0";
//    private static final String DB_PASSWORD = "jcs_0";
    //
    private static final String DB_URL = "jdbc:oracle:thin:@localhost:1521:ZHNG";
    private static final String DB_USERNAME = "scott";
    private static final String DB_PASSWORD = "tiger";
    private static final String DB_DRIVER_NAME = "oracle.jdbc.driver.OracleDriver";
    
    //1.根据ID查询出JUser表中的所有记录
    private static final String SQL_SEELECT_ALL_JUSER
            = "SELECT id,accounts,username,password,extra FROM JUser";
    //1.1根据ID查询出JUser表中的所有记录
    private static final String SQL_SEELECT_JUSER_By_ID
            = "SELECT id,accounts,username,password,extra FROM JUser where id=?";
    //2.更新密码
    private static final String SQL_UPDATE_JUSER_PASSWORD
            = "UPDATE JUser SET password=? where id=? and accounts=?";
    //update JUser set password = 'as' where id = 'j001' and accounts = 'j001';
    //3.删除账号
    private static final String SQL_DELETE_JUSER = "DELETE FROM JUser where id=?";
    //4.插入记录
    private static final String SQL_INSERT_JUSER
            = "INSERT INTO JUser(id,accounts,username,password,extra) values(?,?,?,?,?)";

    private  static Connection connection = null;
    private  static PreparedStatement preparedStatement = null;
    private  static ResultSet resultSet = null;

    public static void main( String args[] ) throws Exception {
        //读取数据
        //readData();
        //插入记录
        //insertData();

        //更新数据
        String id = "j001";
        String accounts = "j001";
        String password = "sasa";
        updateData( id, accounts, password );
        readData();
        close();
    }
    //获取数据库连接
    public static Connection getConnection( Connection connection ) throws  Exception {
        if( connection != null ) {
            return  connection;
        } else {
            //1.注册驱动
            Class.forName( DB_DRIVER_NAME );
            //2.建立连接 默认自动提交
            connection = DriverManager.getConnection( DB_URL, DB_USERNAME, DB_PASSWORD );
            return connection;
        }
    }
    //读取数据
    public static void readData() throws Exception {
        connection = getConnection( connection );
        //3.查询JUser表中的所有记录
        preparedStatement = connection.prepareStatement( SQL_SEELECT_ALL_JUSER );
        //4.执行查询动作
        resultSet = preparedStatement.executeQuery();
        //5.操作结果集
        while ( resultSet.next() ) {
            String id = resultSet.getString( "id" );
            String accounts = resultSet.getString( "accounts" );
            String username = resultSet.getString( "username" );
            String password = resultSet.getString( "password" );
            String extra = resultSet.getString( "extra" );
            System.out.println( "*******" );
            System.out.println( "id: " + id );
            System.out.println( "accounts: " + accounts );
            System.out.println( "username: " + username );
            System.out.println( "password: " + password );
            System.out.println( "extra: " + extra );
            System.out.println( "=======" );
        }
    }
    //关闭连接 此时没有捕获异常
    public static void close() throws Exception {
        //6.关闭连接
        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
    //插入数据
    //没有检查是否已存在
    public static void insertData() throws Exception {
        String[] data =
                //new String[ 5 ];
                //和js中的表示不同[] --> {}
                { "j001", "j001", "j0010", "a", "extra is default!`"};
        if ( isExist( data[0] ) ) {
            System.out.println( "记录[" + data[0] + "]已存在！~");//可执行更新操作
            return;
        }
        connection = getConnection( connection );
        preparedStatement = connection.prepareStatement( SQL_INSERT_JUSER );
        preparedStatement.setString(1, data[0] );
        preparedStatement.setString(2, data[1] );
        preparedStatement.setString(3, data[2] );
        preparedStatement.setString(4, data[3] );
        preparedStatement.setString(5, data[4] );
        preparedStatement.executeUpdate();
    }
    //是否已存在
    public static boolean isExist( String id ) throws Exception {
        boolean ret = false;
        connection = getConnection( connection );
        preparedStatement = connection.prepareStatement(SQL_SEELECT_JUSER_By_ID );
        preparedStatement.setString( 1, id );
        resultSet = preparedStatement.executeQuery();
        if ( resultSet.next() ) {
            ret = true;
        }
        return ret;
    }
    //根据ID和账号修改密码
    public static void updateData( String id, String accounts,String password ) throws Exception {
        connection = getConnection( connection );
        if ( isExist( id ) ) { // 注意PreparedStatement对象
            preparedStatement = connection.prepareStatement( SQL_UPDATE_JUSER_PASSWORD );
            preparedStatement.setString( 1, password );
            preparedStatement.setString( 2, id );
            preparedStatement.setString( 3, accounts );
            preparedStatement.executeUpdate();
        } else {
            System.out.println( "账号不存在" );
        }
        
    }
}
