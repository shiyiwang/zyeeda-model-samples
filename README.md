model 部属指南
================

安装`nodejs` 与 `coffee-script`
------------------------------
  *  [nodejs](http://nodejs.org/)
  *  [coffee-script](http://jashkenas.github.com/coffee-script/)

配置mvn私服
---------

在 `$MAVEN_HOME/conf` 目录或 `~/.m2/`目录的 `settings.xml` 文件中加上以下代码

    <mirrors>
        <mirror>
            <id>nexus</id>
            <mirrorOf>*</mirrorOf>
            <url>http://192.168.1.11:8081/nexus/content/groups/public</url>
        </mirror>
    </mirrors>

    <profile>
      <id>nexus</id>
      <repositories>
        <repository>
          <id>central</id>
          <url>http://central</url>
          <releases><enabled>true</enabled></releases>
          <snapshots><enabled>true</enabled></snapshots>
        </repository>
      </repositories>
     <pluginRepositories>
        <pluginRepository>
          <id>central</id>
          <url>http://central</url>
          <releases><enabled>true</enabled></releases>
          <snapshots><enabled>true</enabled></snapshots>
        </pluginRepository>
      </pluginRepositories>
    </profile>

    <activeProfiles>
        <activeProfile>nexus</activeProfile>
    </activeProfiles>

安装 zyeeda-project
------------------

  *  从192.168.1.14上克隆 zyeeda-project
      hg clone http://192.168.1.14/hg/zyeeda-project
  *  在克隆后的目录里执行 `mvn install`

安装 zyeeda-framework-2.0
------------------------

  *  从192.168.1.14上克隆 zyeeda-framework-2.0
  *  执行 `cake build`
  *  执行 `mvn install`
# zyeeda-model-samples 
