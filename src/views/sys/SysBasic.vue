<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="1">
                <DepMana></DepMana>
            </el-tab-pane>
            <el-tab-pane label="职位管理" name="2">
                <PosMana></PosMana>
            </el-tab-pane>
            <el-tab-pane label="职称管理" name="3">
                <JobLevelMana></JobLevelMana>
            </el-tab-pane>
            <el-tab-pane label="奖惩规则" name="4">
                <ECMana></ECMana>
            </el-tab-pane>
            <el-tab-pane label="权限组" name="5">
                <PermMana></PermMana>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepMana from '../../components/sys/basic/DepMana';
    import PosMana from '../../components/sys/basic/PosMana';
    import JobLevelMana from '../../components/sys/basic/JobLevelMana';
    import ECMana from '../../components/sys/basic/ECMana';
    import PermMana from '../../components/sys/basic/PermMana';

    export default {
        name: "SysBasic",
        data() {
            return {
                activeName: '5'
            }
        },
        methods: {},
        components: {
            DepMana,
            PosMana,
            JobLevelMana,
            ECMana,
            PermMana
        }
    }
</script>

<style scoped>

</style>