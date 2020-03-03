<template>
    <div>
        <!-- 顶部工具 -->
        <div class="top-tools">
            <div>
                <el-input class="tool" v-model="keyword" size="small" prefix-icon="el-icon-search"
                          placeholder="请输入您要搜索的「雇员名称」"
                          style="width: 300px;"
                          @clear="initTableData"
                          clearable></el-input>
                <el-button class="tool" type="primary" size="small"
                           icon="el-icon-search"
                           @click="initTableData">
                    搜索
                </el-button>
                <el-button class="tool" type="primary" size="small">
                    <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                    高级搜索
                </el-button>
            </div>
            <div>
                <el-button class="tool" type="success" icon="el-icon-download" size="small" @click="handleExportExcel">
                    导出Excel
                </el-button>
                <el-upload
                        class="tool upload"
                        action="/employee/basic/excel"
                        :show-file-list="false"
                        :before-upload="beforeHandleImport"
                        :on-progress="handleImportProcess"
                        :on-success="handleImportSuccess"
                        :on-error="handleImportError"
                        :disabled="disabledUpload">
                    <el-button type="success" icon="el-icon-upload2" size="small">
                        导入Excel
                    </el-button>
                </el-upload>
                <el-button class="tool" type="primary"
                           @click="handleAddEmployee"
                           size="small" icon="el-icon-plus">添加雇员
                </el-button>
            </div>
        </div>

        <!-- 数据展示 -->
        <el-table :data="tableData" size="small" border stripe fit style="width: 100%; margin-bottom: 15px;">
            <el-table-column type="selection" width="40" fixed></el-table-column>
            <el-table-column prop="workid" label="工号" width="80" fixed></el-table-column>
            <el-table-column prop="name" label="姓名" width="90" fixed></el-table-column>
            <el-table-column prop="gender" label="性别" width="50"></el-table-column>
            <el-table-column prop="birthday" label="出生年月" width="100"></el-table-column>
            <el-table-column prop="idcard" label="身份证号" width="150"></el-table-column>
            <el-table-column prop="wedlock" label="婚姻状况" width="80"></el-table-column>
            <el-table-column prop="nation.name" label="民族" width="60"></el-table-column>
            <el-table-column prop="nativeplace" label="籍贯" width="100"></el-table-column>
            <el-table-column prop="politicsstatus.name" label="政治面貌" width="80"></el-table-column>
            <el-table-column prop="email" label="邮箱账号" width="150"></el-table-column>
            <el-table-column prop="phone" label="电话号码" width="120"></el-table-column>
            <el-table-column prop="address" label="家庭住址" width="180"></el-table-column>
            <el-table-column prop="department.name" label="所属部门" width="100"></el-table-column>
            <el-table-column prop="joblevel.name" label="职称" width="120"></el-table-column>
            <el-table-column prop="joblevel.titlelevel" label="职级" width="100"></el-table-column>
            <el-table-column prop="position.name" label="职位" width="100"></el-table-column>
            <el-table-column prop="engageform" label="聘用形式" width="80"></el-table-column>
            <el-table-column prop="tiptopdegree" label="学历" width="50"></el-table-column>
            <el-table-column prop="specialty" label="专业" width="140"></el-table-column>
            <el-table-column prop="school" label="毕业院校" width="120"></el-table-column>
            <el-table-column prop="begindate" label="入职日期" width="120"></el-table-column>
            <el-table-column prop="conversiontime" label="转正日期" width="120"></el-table-column>
            <el-table-column prop="workstate" label="在职状态" width="80"></el-table-column>
            <el-table-column label="合约期限" width="80">
                <template slot-scope="scope">
                    <el-tag size="mini">{{scope.row.contractterm}}</el-tag>&nbsp;年
                </template>
            </el-table-column>
            <el-table-column prop="begincontract" label="合同期始" width="120"></el-table-column>
            <el-table-column prop="endcontract" label="合同期止" width="120"></el-table-column>
            <el-table-column prop="workage" label="工龄" width="50"></el-table-column>
            <el-table-column prop="notworkdate" label="离职日期" width="120"></el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <div style="display: flex; justify-content: space-around;">
                        <el-button type="primary" size="mini" icon="el-icon-edit" circle></el-button>
                        <el-button type="primary" size="mini" icon="el-icon-view" circle></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 底部工具 -->
        <div class="bottom-tools">
            <el-button type="danger" size="small">批量删除</el-button>
            <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getRequest} from "../../utils/api";
    import {postRequest} from "../../utils/api";
    import {putRequest} from "../../utils/api";
    import {deleteRequest} from "../../utils/api";

    export default {
        name: "EmpBasic",
        data() {
            return {
                keyword: '',
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 10,
                disabledUpload: false,
            }
        },
        mounted() {
            this.initTableData();
        },
        methods: {
            initTableData() {
                getRequest(
                    '/employee/basic/' +
                    '?page=' + this.currentPage +
                    '&size=' + this.pageSize +
                    '&keyword=' + this.keyword
                ).then(resp => {
                    if (resp) {
                        this.tableData = resp.data;
                        this.total = resp.total;
                    }
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.initTableData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.initTableData();
            },
            handleExportExcel() {
                window.open('/employee/basic/excel', '_parent');
            },
            beforeHandleImport(file) {
                const isExcel = file.type === 'application/vnd.ms-excel';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isExcel) {
                    this.$message.error('上传的文件只能是 Excel 文件!');
                }
                if (!isLt2M) {
                    this.$message.error('上传的文件大小不能超过 2MB!');
                }
                return isExcel && isLt2M;
            },
            handleImportProcess() {
                this.disabledUpload = true;
            },
            handleImportSuccess(resp) {
                this.disabledUpload = false;
                if (resp && resp.status === 200) {
                    this.$message.success(resp.msg);
                    this.initTableData();
                } else {
                    this.$message.error(resp.msg);
                }
            },
            handleImportError(err) {
                console.log(err);
                this.disabledUpload = false;
                this.$message.error(err.message);
            },
            handleAddEmployee() {
                postRequest('/employee/basic/').then(resp => {
                    if (resp && resp.status === 200) {
                        this.initTableData();
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .top-tools {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    }

    .tool + .tool {
        margin-left: 10px;
    }

    .top-tools .upload {
        display: inline-flex;
    }

    .bottom-tools {
        display: flex;
        justify-content: space-between;
    }
</style>