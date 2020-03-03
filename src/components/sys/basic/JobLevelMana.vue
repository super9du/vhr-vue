<template>
    <div>
        <div class="op-box">
            <div>
                <el-input style="width: 300px;"
                          v-model="jobLevel.name"
                          placeholder="请输入职称"
                          prefix-icon="el-icon-plus"
                          size="small" clearable>
                </el-input>
                <el-select style="margin: 0 10px;"
                           v-model="jobLevel.titlelevel"
                           placeholder="请选择职级"
                           size="small"
                           clearable>
                    <el-option
                            v-for="item in titleLevels"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button type="primary"
                           size="small"
                           icon="el-icon-plus"
                           @click="handleAdd">添加
                </el-button>
            </div>
            <el-button type="danger"
                       size="small"
                       icon="el-icon-delete"
                       @click="handleManyDelete"
                       :disabled="!deletable">批量删除
            </el-button>
        </div>
        <el-table border
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="编号"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="职称名称">
            </el-table-column>
            <el-table-column
                    prop="titlelevel"
                    label="职称级别"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="enabled"
                    label="启用状态"
                    width="120">
                <template slot-scope="scope">
                    <el-tag size="mini" type="success" v-if="scope.row.enabled">已启用</el-tag>
                    <el-tag size="mini" type="danger" v-else>未启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createdate"
                    label="创建时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="showEdit(scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑职称对话框 -->
        <el-dialog title="编辑职称" :visible.sync="editJobLevelVisible" width="400px">
            <el-form label-position="left" label-width="80px" :model="updateJobLv">
                <el-form-item label="职称名称">
                    <el-input v-model="updateJobLv.name" autocomplete="off" size="small"
                              @keypress.enter.native="handleEdit"
                              placeholder="请输入职称名称">
                    </el-input>
                </el-form-item>
                <el-form-item label="职称级别">
                    <el-select v-model="updateJobLv.titlelevel"
                               placeholder="请选择职级"
                               size="small"
                               clearable>
                        <el-option
                                v-for="item in titleLevels"
                                :key="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用状态">
                    <el-switch v-model="updateJobLv.enabled" style="margin-right: 10px"></el-switch>
                    <span v-if="updateJobLv.enabled" style="color: #409eff;">启用</span>
                    <span v-else style="color: #acafb6;">禁用</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editJobLevelVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getRequest} from "../../../utils/api";
    import {postRequest} from "../../../utils/api";
    import {putRequest} from "../../../utils/api";
    import {deleteRequest} from "../../../utils/api";

    export default {
        name: "JobLevelMana",
        data() {
            return {
                jobLevel: {
                    name: '',
                    titlelevel: ''
                },
                updateJobLv: {
                    id: 0,
                    name: '',
                    titlelevel: '',
                    enabled: true
                },
                titleLevels: [
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ],
                tableData: [],
                multipleSelection: [],
                deletable: false,
                editJobLevelVisible: false,
            }
        },
        mounted() {
            this.initTableData();
        },
        methods: {
            handleAdd() {
                if (!this.jobLevel.name) {
                    this.$message.error('「职位名称」不可为空');
                } else if (!this.jobLevel.titlelevel) {
                    this.$message.error('「职级」不可为空');
                } else {
                    postRequest('/system/basic/jobLv/', this.jobLevel).then(resp => {
                        if (resp && resp.status === 200) {
                            this.initTableData();
                            // this.jobLevel = {};
                        }
                    });
                }
            },
            handleDelete(row) {
                this.$confirm('此操作将永久删除【' + row.name + '】职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest('/system/basic/jobLv/' + row.id).then(resp => {
                        if (resp && resp.status === 200) {
                            this.initTableData();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showEdit(row) {
                Object.assign(this.updateJobLv, row);
                this.editJobLevelVisible = true;
            },
            handleEdit() {
                putRequest('/system/basic/jobLv/', this.updateJobLv).then(resp => {
                    if (resp && resp.status === 200) {
                        this.editJobLevelVisible = false;
                        this.initTableData();
                    }
                })
            },
            initTableData() {
                getRequest('/system/basic/jobLv/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.tableData = resp.obj;
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.deletable = val.length > 0;
            },
            handleManyDelete() {
                this.$confirm('此操作将批量删除【' + this.multipleSelection.length + '】条职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    this.multipleSelection.forEach(jobLevel => {
                        ids.push(jobLevel.id);
                    });
                    deleteRequest('/system/basic/jobLv/', ids).then(resp => {
                        if (resp && resp.status === 200) {
                            this.initTableData();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style>
    .op-box {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }
</style>