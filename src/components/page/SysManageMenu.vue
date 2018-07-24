<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>菜单树</span>
                        </div>
                        <el-tree
                            :data="menuTreeData"
                            node-key="id"
                            :expand-on-click-node="false"
                            :default-expand-all="true"
                            :props="defaultProps"
                            @node-click="treeClick"
                        >
                        </el-tree>
                    </el-card>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{getMenuTableName}} <i class="el-icon-d-arrow-right"></i> 下级列表 </span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="showMenuAdd()">添加下级权限
                            </el-button>
                        </div>
                        <el-table :data="menuTableData" border style="width: 100%">
                            <el-table-column prop="id" label="ID" width="50"/>
                            <el-table-column prop="name" label="菜单名" width="100"/>
                            <el-table-column prop="type" label="元素类型" width="100" :formatter="formatterType"/>
                            <el-table-column prop="authIcon" label="图标"/>
                            <el-table-column prop="target" label="路由地址"/>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" class="el-icon-edit" @click="showMenuEdit(scope.row)"></el-button>
                                    <el-button size="small" type="danger" class="el-icon-delete" @click="showMenuDelete(scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-row>
            </el-col>
        </el-row>

        <!-- 编辑弹出框 -->
        <el-dialog :title="menuEditTitle" :visible.sync="menuEditVisible" width="30%">
            <el-form :model="menuForm" ref="menuForm" label-width="80px" class="demo-dynamic">
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="menuForm.name" placeholder="请输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="别名" prop="alias">
                    <el-input v-model="menuForm.alias" placeholder="请输入别名"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="authIcon">
                    <el-select v-model="menuForm.authIcon" filterable placeholder="请选择权限类型">
                        <el-option
                            v-for="item in elementIcons"
                            :key="item"
                            :label="item"
                            :value="item">
                            <i :class="item"></i>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="路由地址" prop="target">
                    <el-input v-model="menuForm.target" placeholder="路由地址"></el-input>
                </el-form-item>
                <el-form-item label="访问地址" prop="url">
                    <el-input v-model="menuForm.url" placeholder="访问地址"></el-input>
                </el-form-item>
                <el-form-item label="终端类型" prop="type">
                    <el-select v-model="menuForm.terminalType" placeholder="请选择终端类型">
                        <el-option label="WEB" value="0"/>
                        <el-option label="移动端" value="1"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限类型" prop="type">
                    <el-select v-model="menuForm.type" placeholder="请选择权限类型">
                        <el-option label="页面元素" value="0"/>
                        <el-option label="节点元素" value="1"/>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menuEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenu()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="menuDeleteVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menuDeleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteMenu">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from "../../fetch/Api";
    import icon from "../../util/icon";

    export default {
        name: 'SysManageMenu',
        data() {
            return {
                elementIcons: icon.element_ui_icon,
                menuTreeData: [{
                    id: 0,
                    label: '菜单树',
                }],
                menuTableData: [],
                getMenuTableName: '菜单树',
                getMenuTableParentId: 0,
                menuEditVisible: false,
                menuEditTitle: '',
                menuDeleteVisible: false,
                menuDeletePrimaryKey: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                menuForm: {
                    id: null,
                    name: '',
                    parentId: '',
                    alias: '',
                    terminalType: '',
                    type: '',
                    authIcon: '',
                    target: '',
                    url: ''
                }
            }
        },
        created() {
            this.getAuthorizationTreeData();
            this.getAuthorizationTableData();
        },
        methods: {
            // 获取左侧权限树
            getAuthorizationTreeData() {
                api.getAuthorizationTree(0, 0, 0)
                    .then(result => {
                        this.menuTreeData = result;
                        this.menuTreeData = [{
                            id: 0,
                            name: '权限树',
                            children: result
                        }]
                    })
                    .catch(error => {
                        this.$message.error(`获取权限树出现异常` + error);
                    })
            },
            // 获取右侧权限列表
            getAuthorizationTableData() {
                api.getAuthorizationTree(this.getMenuTableParentId, 0, 1)
                    .then(result => {
                        this.menuTableData = result;
                    })
                    .catch(error => {
                        this.$message.error(`获取权限列表出现异常` + error);
                    })
            },
            // tree点击事件
            treeClick(data, node, tree) {
                console.log(data)
                this.getMenuTableParentId = data.id
                this.getMenuTableName = data.name
                this.getAuthorizationTableData();
            },
            // 打开资源编辑弹出层
            showMenuEdit(row) {
                api.getAuthorizationByPrimaryKey(row.id)
                    .then(result => {
                        this.menuForm = result;
                        if (result.type) {
                            this.menuForm.type = '1';
                        } else {
                            this.menuForm.type = '0';
                        }
                        if (result.terminalType) {
                            this.menuForm.terminalType = '1';
                        } else {
                            this.menuForm.terminalType = '0';
                        }
                        this.menuEditTitle = '编辑 : ' + row.name;
                        this.menuEditVisible = true;
                    })
                    .catch(error => {
                        this.$message.error(`修改权限出现异常` + error);
                    })
            },
            showMenuAdd() {
                this.menuEditTitle = '添加 : ' + this.getMenuTableName + ' 下级权限';
                this.menuEditVisible = true;
                this.menuForm = {
                    id: null,
                    name: '',
                    parentId: this.getMenuTableParentId,
                    alias: '',
                    terminalType: '',
                    type: '',
                    authIcon: '',
                    target: '',
                    url: ''
                }
            },
            // 保存权限
            saveMenu(){
                console.log(this.menuForm)
                if(this.menuForm.id){
                    this.menuForm.terminalType = Number(this.menuForm.terminalType);
                    this.menuForm.type = Number(this.menuForm.type);
                    api.addAuthorization(this.menuForm)
                        .then(result => {
                            this.$message.success(`权限修改完毕`);
                            this.menuEditVisible = false;
                            this.getAuthorizationTreeData();
                            this.getAuthorizationTableData();
                        })
                        .catch(error => {
                            this.$message.error(`修改权限出现异常` + error);
                        })
                }else {
                    this.menuForm.terminalType = Number(this.menuForm.terminalType);
                    this.menuForm.type = Number(this.menuForm.type);
                    api.editAuthorization(this.menuForm)
                        .then(result => {
                            this.$message.success(`权限添加完毕`);
                            this.menuEditVisible = false;
                            this.getAuthorizationTreeData();
                            this.getAuthorizationTableData();
                        })
                        .catch(error => {
                            console.log(error)
                            this.$message.error(`添加权限出现异常` + error);
                        })
                }
            },
            showMenuDelete(row){
                this.menuDeleteVisible = true;
                this.menuDeletePrimaryKey = row.id;
            },
            deleteMenu(){
                api.deleteAuthorization(this.menuDeletePrimaryKey)
                    .then(result => {
                        this.$message.success(`权限删除完毕`);
                        this.menuDeleteVisible = false;
                        this.getAuthorizationTreeData();
                        this.getAuthorizationTableData();
                    })
                    .catch(error => {
                        this.$message.error(`删除权限出现异常` + error);
                    })
            },
            // 格式元素类型
            formatterType(row) {
                if (row.type) {
                    return '标签元素';
                }
                return '页面元素';
            }
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }
</style>
