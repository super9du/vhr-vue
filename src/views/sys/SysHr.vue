<template>
    <div>
        <div style="display: flex; justify-content: center;margin-bottom: 15px">
            <el-input style="width: 500px;margin-right: 5px" v-model="searchText" placeholder="请在此输入 Hr 姓名..."
                      prefix-icon="el-icon-search" size="small"></el-input>
            <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="hr-detail">
            <el-card :class="['box-card', hr.enabled?'':'gray']" v-for="hr in hrs" :key="hr.id">
                <div slot="header" class="box-card-title">
                    <div class="box-card-title--begin">
                        <el-avatar class="margin-left-10" fit="fill" shape="square" size="small"
                                   :src="hr.userface"></el-avatar>
                        <strong class="margin-left-10">{{hr.name}}</strong></div>
                    <div class="box-card-title--end">
                        <el-switch class="margin-left-10"
                                   v-model="hr.enabled"
                                   @change="handleHrStatusChange(hr)">
                        </el-switch>
                        <el-button class="margin-left-10"
                                   style="font-size: small;"
                                   icon="el-icon-delete"
                                   @click="handleHrDelete(hr)"
                                   type="danger" size="mini"
                                   circle></el-button>
                    </div>
                </div>
                <div class="box-card-content">
                    <div>账号：{{hr.username}}</div>
                    <div>手机：{{hr.phone}}</div>
                    <div>电话：{{hr.telephone}}</div>
                    <div>地址：{{hr.address}}</div>
                    <div>角色：
                        <span v-if="hr.roles.length===0">暂无</span>
                        <el-tag class="role-tag"
                                v-for="(role,indexr) in hr.roles"
                                :key="indexr"
                                type="success"
                                size="mini">
                            {{role.namezh}}
                        </el-tag>
                        <el-popover placement="bottom" trigger="click"
                                    @show="showRolesSelector(hr)"
                                    @hide="handleRolesOfHrChange(hr)">
                            <el-select v-model="selectedRids" placeholder="请选择" multiple>
                                <el-option v-for="(opt,indexo) in rolesOpt"
                                           :value="opt.id"
                                           :label="opt.namezh"
                                           :key="indexo"></el-option>
                            </el-select>
                            <el-button class="role-setting"
                                       slot="reference"
                                       type="text"
                                       icon="el-icon-setting"
                                       size="small"></el-button>
                        </el-popover>
                    </div>
                    <div>备注：{{hr.remark}}</div>
                </div>
            </el-card>
            <el-card class="box-card row-center column-center">
                <i style="font-size: x-large" class="el-icon-plus" @click="handleHrAdd"></i>
            </el-card>
        </div>
    </div>
</template>

<script>
    import {getRequest} from "../../utils/api";
    import {postRequest} from "../../utils/api";
    import {putRequest} from "../../utils/api";
    import {deleteRequest} from "../../utils/api";

    export default {
        name: "SysHr",
        data() {
            return {
                hrs: [],
                rolesOpt: [],
                searchText: '',
                selectedRids: [],
            }
        },
        mounted() {
            this.initAllRoles();
            this.initHrData();
        },
        methods: {
            initAllRoles() {
                getRequest('/system/hr/roles').then(resp => {
                    if (resp && resp.status === 200) {
                        this.rolesOpt = resp.obj;
                    }
                })
            },
            initHrData() {
                getRequest('/system/hr/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.hrs = resp.obj;
                    }
                });
            },
            handleHrAdd() {
            },
            handleHrDelete(hr) {
                this.$confirm('此操作将永久删除 HR 【' + hr.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(hr.id);
                    deleteRequest('/system/hr/' + hr.id).then(resp => {
                        if (resp && resp.status === 200) {
                            this.initHrData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleHrStatusChange(hr) {
                putRequest('/system/hr/', hr);
            },
            handleRolesOfHrChange(hr) {
                putRequest('/system/hr/' + hr.id + '/role/', this.selectedRids).then(resp => {
                    if (resp && resp.status === 200) {
                        this.initHrData();
                    } else {
                        hr.enabled = enabled;
                    }
                }).catch(() => {
                    hr.enabled = enabled;
                });
            },
            showRolesSelector(hr) {
                this.selectedRids = [];
                hr.roles.forEach(role => {
                    this.selectedRids.push(role.id);
                })
            }
        }
    }
</script>

<style scoped>
    .gray {
        background-color: #eee;
    }

    .row-center {
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
    }

    .column-center {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }

    .hr-detail {
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
    }

    .box-card {
        color: #606266;
        width: 400px;
        margin: 0 5px 10px;
    }

    .box-card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .box-card-content {
        font-size: small;
        line-height: 1.8em;
    }

    .box-card-title--begin {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .box-card-title--end {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .margin-left-10 + .margin-left-10 {
        margin-left: 10px;
    }

    .role-tag + * {
        margin-left: 5px;
    }

    .role-setting {
        color: #aaa;
    }

    .role-setting:hover {
        color: #606266;
    }
</style>