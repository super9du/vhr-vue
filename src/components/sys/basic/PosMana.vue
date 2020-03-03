<template>
    <div>
        <!-- 添加职位 -->
        <div class="add-panel">
            <el-input style="width: 300px; margin-right: 10px; margin-bottom: 15px;"
                      size="small"
                      placeholder="添加职位"
                      prefix-icon="el-icon-plus"
                      v-model="pos.name"
                      @keypress.enter.native="handleAdd">
            </el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        </div>

        <!-- 展示职位及操作职位 -->
        <el-table
                size="small"
                :data="tableData"
                border
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="编号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="职位名称"
                    width="180">
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
                    label="创建时间"
                    width="180">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="showEdit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="danger" size="small" @click="handleManyDelete">批量删除</el-button>

        <!-- 编辑职位对话框 -->
        <el-dialog title="编辑职位" :visible.sync="editPositionVisible" width="400px">
            <el-form label-position="left" label-width="80px">
                <el-form-item label="职位名称">
                    <el-input v-model="updatePos.name" autocomplete="off" size="small"
                              @keypress.enter.native="handleEdit"></el-input>
                </el-form-item>
                <el-form-item label="启用状态">
                    <el-switch v-model="updatePos.enabled" style="margin-right: 10px"></el-switch>
                    <span v-if="updatePos.enabled" style="color: #409eff;">启用</span>
                    <span v-else style="color: #acafb6;">禁用</span>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editPositionVisible = false">取 消</el-button>
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
        name: "PosMana",
        data() {
            return {
                pos: {
                    name: ''
                },
                updatePos: {
                    id: 0,
                    name: '',
                    enabled: true
                },
                tableData: [],
                editPositionVisible: false,
                multipleSelection: [],
            }
        },
        mounted() {
            this.initTableData()
        },
        methods: {
            initTableData() {
                getRequest('/system/basic/pos/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.tableData = resp.obj;
                    }
                });
            },
            handleAdd() {
                if (this.pos.name && this.pos.name.trim() !== '') {
                    postRequest('/system/basic/pos/', this.pos).then(resp => {
                        if (resp && resp.status === 200) {
                            this.pos.name = '';
                            this.initTableData();
                        }
                    });
                } else {
                    this.$message({
                        message: '职位名称不能为空',
                        type: 'error',
                        showClose: true
                    });
                }
            },
            handleDelete(index, row) {
                this.$confirm('此操作将删除【' + row.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteRequest('/system/basic/pos/' + row.id).then(resp => {
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
            showEdit(index, row) {
                Object.assign(this.updatePos, row);
                this.editPositionVisible = true;
            },
            handleEdit() {
                putRequest('/system/basic/pos/', this.updatePos).then(resp => {
                    if (resp && resp.status === 200) {
                        this.editPositionVisible = false;
                        this.initTableData();
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
            },
            handleManyDelete() {
                let ids = [];
                this.multipleSelection.forEach(pos => {
                    ids.push(pos.id);
                });
                console.log(ids);
                deleteRequest('/system/basic/pos/', ids).then(resp => {
                    if (resp && resp.status === 200) {
                        this.initTableData();
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>