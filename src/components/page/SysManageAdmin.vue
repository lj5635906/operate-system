<template>
    <div class="table">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="deleteAdmin">批量删除</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="showAddAdmin">添加用户</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"/>
                <el-table-column prop="id" label="ID" width="50"/>
                <el-table-column prop="adminName" label="姓名" width="100"/>
                <el-table-column prop="account" label="账号" width="100"/>
                <el-table-column prop="birthday" label="生日" width="100" :formatter="formatBirthday"/>
                <el-table-column prop="state" label="状态" width="100" :formatter="formatState"/>
                <el-table-column prop="loginCount" label="登录次数" width="70"/>
                <el-table-column prop="lastLogin" label="最后一次登录时间" width="150" :formatter="formatLastLogin"/>
                <el-table-column prop="createTime" label="创建时间" sortable width="150" :formatter="formatCreateTime"/>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" class="el-icon-edit" @click="showAdminEdit(scope.row)"></el-button>
                        <el-button size="small" class="el-icon-delete" type="danger" @click="showAdminDelete(scope.row)"></el-button>
                        <el-button size="small"  @click="showAdminAssignRole(scope.row)">角色分配</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="size"
                               :total="totalPage">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="adminEditTitle" :visible.sync="adminEditVisible" width="30%">
            <el-form :model="ruleForm" :role="adminRules" ref="ruleForm" label-width="50px" class="demo-dynamic">
                <el-form-item label="姓名" prop="adminName">
                    <el-input v-model="ruleForm.adminName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="headImage">
                    <el-input v-model="ruleForm.headImage" placeholder="请输入头像"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker type="date" placeholder="请选择日期" v-model="ruleForm.birthday"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="ruleForm.state" placeholder="请选择状态">
                        <el-option label="待激活" value="0"/>
                        <el-option label="正常" value="1"/>
                        <el-option label="锁定" value="2"/>
                        <el-option label="注销" value="3"/>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adminEditVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdmin('ruleForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色弹出框 -->
        <el-dialog title="角色分配" :visible.sync="assignRoleVisible" width="50%">
            <el-table :data="tableRoleData" border style="width: 100%" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" prop="id"/>
                <el-table-column prop="id" label="ID" width="50"/>
                <el-table-column prop="roleName" label="角色名"/>
                <el-table-column prop="remark" label="备注"/>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="assignRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="adminAssignRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="adminDeleteVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adminDeleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteAdmin">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from "../../fetch/Api"
    import format from "../../util/date"

    export default {
        name: 'SysManageAdmin',
        data() {
            return {
                loading: true,
                tableData: [],
                tableRoleData: [],
                page: 1,
                size: 10,
                totalPage: 1000,
                multipleSelection: [],
                adminEditVisible: false,
                adminDeleteVisible: false,
                assignRoleVisible: false,
                assignRoleAdminId: '',
                adminEditTitle: '',
                adminDeleteKeys: [],
                ruleForm: {
                    id: '',
                    adminName: '',
                    mobile: '',
                    email: '',
                    headImage: '',
                    account: '',
                    password: '',
                    birthday: '',
                    state: ''
                },
                adminRules: {
                    adminName: [
                        {required: true, message: '请输入管理员名', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入电话', trigger: 'blur'}
                    ],
                    email: [
                        {type: 'email', required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    ],
                    headImage: [
                        {required: true, message: '请输入头像', trigger: 'blur'}
                    ],
                    account: [
                        {length: 8, required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    birthday: [
                        {type: 'date', required: true, message: '请选择生日', trigger: 'blur'}
                    ],
                    state: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getAdminPage();
        },
        methods: {
            // 分页方法跳转
            handleCurrentChange(val) {
                this.page = val;
                this.getAdminPage();
            },
            // 获取管理用户-分页
            getAdminPage() {
                api.getAdminPage(this.page - 1, this.size)
                    .then(result => {
                        console.log(result)
                        this.tableData = result.content;
                        console.log("totalpages: " + result.totalPages);
                        this.totalPage = result.totalPages * this.size;
                    }).catch(error => {
                    alert("分页获取管理员数据出现异常 : " + error)
                })
            },
            // 展示添加管理用户
            showAddAdmin() {
                this.adminEditTitle = '添加管理员'
                this.ruleForm = {
                    id: '',
                    adminName: '',
                    mobile: '',
                    email: '',
                    headImage: '',
                    account: '',
                    password: '',
                    birthday: '',
                    state: ''
                }
                this.adminEditVisible = true;
            },
            // 展示编辑管理员用户
            showAdminEdit(row) {
                var primaryKey = row.id;
                api.getAdminByPrimaryKey(primaryKey)
                    .then(result => {
                        this.adminEditTitle = '编辑 : ' + result.adminName;
                        console.log(result)
                        this.ruleForm = {
                            id: result.id,
                            adminName: result.adminName,
                            mobile: result.mobile,
                            email: result.email,
                            headImage: result.headImage,
                            account: result.account,
                            password: 'NO',
                            birthday: result.birthday,
                            state: result.state.toString()
                        }
                        this.adminEditVisible = true;
                    }).catch(error => {

                })
            },
            // 展示分配角色
            showAdminAssignRole(row) {
                this.assignRoleAdminId = row.id;
                api.getRoleAll()
                    .then(result => {
                        this.tableRoleData = result;
                        this.assignRoleVisible = true;
                    })
                    .catch(error => {
                        alert("获取角色列表出现异常" + error)
                    })

                var account = row.account;
                console.log(account)
                // 初始化已分配的角色
                api.getHasRoleByAccount(account)
                    .then(result => {
                        for (var i = 0; i < result.length; i++) {
                            var has = result[i];
                            for (var j = 0; j < this.tableRoleData.length; j++) {
                                if (has == this.tableRoleData[j].id) {
                                    this.$refs.multipleTable.toggleRowSelection(this.tableRoleData[j]);
                                }
                            }
                        }
                    })
                    .catch(error => {
                        alert("初始化已分配的角色出现异常" + error)
                    })
            },
            // 展示删除管理员用户
            showAdminDelete(row) {
                this.adminDeleteKeys[0] = row.id;
                this.adminDeleteVisible = true;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(this.multipleSelection)
            },
            adminAssignRole() {
                var roles = [];
                for (var i = 0; i < this.multipleSelection.length; i++) {
                    roles[i] = this.multipleSelection[i].id;
                }
                console.log("分配角色AdminId : " + this.assignRoleAdminId)
                console.log(roles)

                var param = {
                    adminId: this.assignRoleAdminId,
                    roleIds: roles
                }
                api.adminAssignRole(param)
                    .then(result => {
                        this.$message.success(`角色分配成功`);
                    })
                    .catch(error => {
                        alert("管理员分配角色出现异常 : " + error)
                    })

            },
            saveAdmin(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.id) {
                            api.modifyAdmin(this.ruleForm)
                                .then(result => {
                                    this.$message.success(`管理员信息修改完毕`);
                                    this.adminEditVisible = false;
                                    this.getAdminPage();
                                })
                                .catch(error => {
                                    this.$message.error(`修改管理员出现异常` + error);
                                })
                        } else {
                            api.saveAdmin(this.ruleForm)
                                .then(result => {
                                    this.$message.success(`添加管理员完毕`);
                                    this.adminEditVisible = false;
                                    this.getAdminPage();
                                })
                                .catch(error => {
                                    this.$message.error(`添加管理员出现异常` + error);
                                })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 确定删除
            deleteAdmin() {
                if (this.multipleSelection.length > 0) {
                    this.multipleSelection.forEach((value, index) => {
                        this.adminDeleteKeys[index] = value.id
                    })
                }
                var params = {ids: this.adminDeleteKeys}
                api.deleteAdmin(params)
                    .then(result => {
                        this.$message.success('删除成功');
                        this.adminDeleteVisible = false;
                        this.multipleSelection = [];
                        this.adminDeleteKeys = [];
                        this.getAdminPage();
                    })
                    .catch(error => {
                        this.$message.error('删除出现异常' + error);
                        this.adminDeleteVisible = false;
                    })
            },
            formatState(row, column) {
                var state = row.state;
                if (state == 0) {
                    return '未激活';
                } else if (state == 1) {
                    return '正常';
                } else if (state == 2) {
                    return '锁定';
                } else if (state == 3) {
                    return '已注销';
                } else {
                    return '不清楚';
                }
            },
            formatBirthday(value, row, column) {
                return format.formatYYYYMMdd(value.birthday);
            },
            formatLastLogin(value, row, column) {
                return format.formatYYYYMMddHHmmSS(value.lastLogin);
            },
            formatCreateTime(value, row, column) {
                return format.formatYYYYMMddHHmmSS(value.createTime);
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
