<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>菜单树</span>
                            <el-button style="float: right; padding: 5px 0" type="text"
                                       @click="submitAssignAuthorization()">确认分配权限
                            </el-button>
                            <i style="float: right; padding: 3px 10px" class="el-icon-d-arrow-right"></i>
                            <span style="float: right; padding: 3px 10px">{{assignAuthorization}}</span>
                        </div>
                        <el-tree
                            :data="roleTreeData"
                            node-key="id"
                            show-checkbox
                            :expand-on-click-node="false"
                            :default-expand-all="true"
                            :props="defaultProps"
                            ref="tree"
                        >
                        </el-tree>
                    </el-card>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span> 角色列表 </span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="showRoleAdd()">添加角色
                            </el-button>
                        </div>
                        <el-table :data="roleTableData" border style="width: 100%">
                            <el-table-column prop="id" label="ID" width="50"/>
                            <el-table-column prop="roleName" label="角色名"/>
                            <el-table-column prop="remark" label="备注"/>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" class="el-icon-edit"
                                               @click="showRoleEdit(scope.row)"></el-button>
                                    <el-button size="small" class="el-icon-delete" type="danger"
                                               @click="showRoleDelete(scope.row)"></el-button>
                                    <el-button size="small" @click="getHasAuthorization(scope.row)">分配权限</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-row>
            </el-col>
        </el-row>

        <!-- 编辑弹出框 -->
        <el-dialog title="添加角色" :visible.sync="roleEditVisible" width="30%" :close-on-click-modal="false">
            <el-form :model="roleForm" ref="roleForm" label-width="80px" class="demo-dynamic">
                <el-form-item label="角色名" prop="name">
                    <el-input v-model="roleForm.roleName" placeholder="请输入角色名"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="roleForm.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRole()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="roleDeleteVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDeleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRole">确 定</el-button>
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
                roleTreeData: [{
                    id: 0,
                    label: '菜单树',
                }],
                roleTableData: [],
                currentRow: null,
                roleEditVisible: false,
                roleDeleteVisible: false,
                roleDeletePrimaryKey: '',
                assignAuthorization: '',
                assignAuthorizationRoleId: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleForm: {
                    id: null,
                    roleName: '',
                    remark: ''
                }
            }
        },
        created() {
            this.getAuthorizationTreeData();
            this.getRoleTableData();
        },
        methods: {
            // 获取左侧权限树
            getAuthorizationTreeData() {
                api.getAuthorizationTree(0, 0, 0)
                    .then(result => {
                        this.roleTreeData = result;
                        this.roleTreeData = [{
                            id: 0,
                            name: '权限树',
                            children: result
                        }]
                    })
                    .catch(error => {
                        this.$message.error(`获取权限树出现异常` + error);
                    })
            },
            // 获取右侧角色列表
            getRoleTableData() {
                api.getRoleList()
                    .then(result => {
                        this.roleTableData = result;
                    })
                    .catch(error => {
                        this.$message.error(`获取角色列表出现异常` + error);
                    })
            },
            getHasAuthorization(val) {
                this.currentRow = val;
                this.assignAuthorization = val.roleName;
                this.assignAuthorizationRoleId = val.id;
                api.getHasAuthorizationByRole(this.currentRow.id)
                    .then(result => {
                        this.$refs.tree.setCheckedKeys(result);
                    })
                    .catch(error => {
                        this.$message.error(`获取角色已有的权限出现异常` + error);
                    })
            },
            // 打开资源编辑弹出层
            showRoleEdit(row) {
                api.getRole(row.id)
                    .then(result => {
                        this.roleForm = {
                            id: result.id,
                            roleName: result.roleName,
                            remark: result.remark
                        };
                        this.roleEditVisible = true;
                    })
                    .catch(error => {
                        this.$message.error(`获取角色列表出现异常` + error);
                    })
            },
            showRoleAdd() {
                this.roleEditVisible = true;
                this.roleForm = {
                    id: null,
                    roleName: '',
                    remark: ''
                }
            },
            // 保存权限
            saveRole() {
                console.log(this.roleForm)
                if (this.roleForm.id) {
                    api.editRole(this.roleForm)
                        .then(result => {
                            this.$message.success(`角色修改完毕`);
                            this.roleEditVisible = false;
                            this.getRoleTableData();
                        })
                        .catch(error => {
                            this.$message.error(`修改角色出现异常` + error);
                        })
                } else {
                    api.saveRole(this.roleForm)
                        .then(result => {
                            this.$message.success(`添加修改完毕`);
                            this.roleEditVisible = false;
                            this.getRoleTableData();
                        })
                        .catch(error => {
                            this.$message.error(`添加角色出现异常` + error);
                        })
                }
            },
            showRoleDelete(row) {
                this.roleDeleteVisible = true;
                this.roleDeletePrimaryKey = row.id;
            },
            deleteRole() {
                api.deleteRole(this.roleDeletePrimaryKey)
                    .then(result => {
                        this.$message.success(`角色删除完毕`);
                        this.roleDeleteVisible = false;
                        this.getRoleTableData();
                    })
                    .catch(error => {
                        this.$message.error(`删除角色出现异常` + error);
                    })
            },
            // 分配权限
            submitAssignAuthorization() {
                var checked = this.$refs.tree.getCheckedKeys();
                var halfChecked = this.$refs.tree.getHalfCheckedKeys();
                var authorizationIds = [];
                checked.forEach(function (value, index) {
                    authorizationIds[index] = value;
                })
                halfChecked.forEach(function (value) {
                    authorizationIds[authorizationIds.length] = value;
                })

                var param = {
                    roleId: this.assignAuthorizationRoleId,
                    authorizationIds: authorizationIds
                };
                if (this.assignAuthorizationRoleId){
                    console.log(param)
                    api.roleAssignAuthorization(param)
                        .then(result => {
                            this.$message.success(`角色分配权限完毕`);
                        })
                        .catch(error => {
                            this.$message.error(`角色分配权限出现异常` + error);
                        })
                }else {
                    this.$message.warning('请选择需要分配权限的角色');
                }
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
