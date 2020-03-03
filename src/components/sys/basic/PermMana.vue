<template>
    <div>
        <div class="add-role">
            <el-input ref="name" class="input-box" v-model="addRole.name" size="small"
                      placeholder="请输入角色英文名"
                      clearable>
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input ref="namezh" class="input-box" v-model="addRole.namezh" size="small"
                      @keypress.enter.native="handleAddRole"
                      placeholder="请输入角色中文名"
                      clearable=""></el-input>
            <el-button size="small" type="primary" @click="handleAddRole" icon="el-icon-plus">添加角色</el-button>
        </div>
        <el-collapse @change="handleCollapseChange" accordion style="width: 600px;">
            <el-collapse-item v-for="(role, rIndex) in roles"
                              :name="role.id"
                              :key="rIndex">
                <template slot="title">
                    <strong>{{role.namezh + ' ' + role.name.substr(5)}}</strong>
                </template>
                <el-tree ref="tree"
                         node-key="id"
                         :data="menus"
                         :props="defaultProps"
                         :default-checked-keys="selectedMenus"
                         @check-change="handleCheckChange(rIndex)"
                         show-checkbox></el-tree>
                <div class="role-option">
                    <!--<el-checkbox @click="handleCheckAllChange">全选</el-checkbox>-->
                    <div>
                        <el-tooltip content="删除角色" placement="top">
                            <el-popconfirm title="确定删除这个角色吗？"
                                           style="padding: 7px 10px;"
                                           @onConfirm="handleDeleteRole(role.id)">
                                <el-button slot="reference" type="danger"
                                           icon="el-icon-minus"
                                           size="mini" circle>
                                </el-button>
                            </el-popconfirm>
                        </el-tooltip>
                        <el-tooltip content="编辑角色" placement="top">
                            <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
                        </el-tooltip>
                    </div>
                    <div>
                        <el-tooltip content="恢复默认" placement="top">
                            <el-button type="success" icon="el-icon-refresh-right"
                                       @click="resetMenusChange(rIndex)"
                                       size="mini" circle></el-button>
                        </el-tooltip>
                        <el-tooltip content="提交修改" placement="top">
                            <el-button type="success" icon="el-icon-check"
                                       @click="handleMenusChange(role.id, rIndex)"
                                       size="mini" circle></el-button>
                        </el-tooltip>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import {getRequest} from "../../../utils/api";
    import {postRequest} from "../../../utils/api";
    import {putRequest} from "../../../utils/api";
    import {deleteRequest} from "../../../utils/api";

    export default {
        name: "PermMana",
        data() {
            return {
                addRole: {
                    name: '',
                    namezh: ''
                },
                role: {
                    id: 0,
                    name: '',
                    namezh: ''
                },
                roles: [],
                menus: [],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
                selectedMenus: [],
                selectAllMenus: [],
                showButton: false,
            }
        },
        mounted() {
            this.initRolesData();
            this.initSelectAllMenusData();
        },
        methods: {
            initRolesData() {
                getRequest('/system/basic/perm/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.roles = resp.obj;
                    }
                });
            },
            initMenusData() {
                getRequest('/system/basic/perm/menus/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.menus = resp.obj[0].children;
                    }
                });
            },
            initSelectedMenusData(rid) {
                getRequest('/system/basic/perm/mids/' + rid).then(resp => {
                    if (resp && resp.status === 200) {
                        this.selectedMenus = resp.obj;
                    }
                });
            },
            initSelectAllMenusData() {
                getRequest('/system/basic/perm/mids/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.selectAllMenus = resp.obj;
                    }
                })
            },
            handleAddRole() {
                if (!this.addRole.name) {
                    this.$message.error('「角色英文名」不可为空');
                    this.$refs.name.focus();
                } else if (!this.addRole.namezh) {
                    this.$message.error('「角色中文名」不可为空');
                    this.$refs.namezh.focus();
                } else {
                    this.addRole.name = 'ROLE_' + this.addRole.name;
                    postRequest('/system/basic/perm/', this.addRole).then(resp => {
                        if (resp && resp.status === 200) {
                            this.initRolesData();
                        }
                    });
                }
            },
            handleEditRole() {

            },
            handleDeleteRole(rid) {
                deleteRequest('/system/basic/perm/' + rid).then(resp => {
                    if (resp && resp.status === 200) {
                        this.initRolesData();
                    }
                });
            },
            handleCollapseChange(rid) {
                if (rid) {
                    this.initSelectedMenusData(rid);
                    this.initMenusData();
                }
            },
            handleMenusChange(rid, index) {
                let checked = this.$refs.tree[index].getCheckedKeys(true);
                console.log(checked);
                putRequest('/system/basic/perm/menus/' + rid, checked).then(resp => {
                    if (resp && resp.status === 200) {
                        this.initMenusData();
                    }
                });
            },
            handleCheckChange(index) {
                // console.log(this.$refs.tree[index].getCheckedKeys(true));
                // console.log(this.selectedMenus.toString());
                // console.log(this.$refs.tree[index].getCheckedKeys(true) != this.selectedMenus.toString());
                // if (this.$refs.tree[index].getCheckedKeys(true) != this.selectedMenus.toString()) {
                //     this.showButton = true;
                // }
                // this.showButton = false;
            },
            handleCheckAllChange(isChecked) {
                // console.log(isChecked);
                // if(isChecked){
                //     this.selectedMenus = this.selectAllMenus;
                //     this.initMenusData();
                // }else {
                //
                // }
            },
            resetMenusChange(index){
                this.$refs.tree[index].setCheckedKeys(this.selectedMenus);
            }
        }
    }
</script>

<style scoped>
    .add-role {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 15px;
    }

    .input-box {
        max-width: 260px;
        margin-right: 5px;
    }

    .role-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #eee;
    }
</style>