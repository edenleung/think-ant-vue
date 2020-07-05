<template>
  <a-modal
    :width="650"
    :title="selected ? '修改菜单' : '添加菜单'"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="$emit('submit')"
    @cancel="$emit('cancel')">
    <a-form :form="form" layout="inline">
      <a-row :gutter="0">
        <a-col :span="12">
          <a-form-item label="菜单类型">
            <a-radio-group
              v-decorator="[
                'type',
                {
                  rules: [{ required: true, message: '请选择类型!' }]
                }
              ]"
            >
              <a-radio-button :value="type.value" v-for="type in typeMap" :key="type.value">{{ type.text }}</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="上级类目" hasFeedback>
            <a-tree-select
              style="min-width:184px"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              placeholder="请选择所属组别"
              allowClear
              treeDefaultExpandAll
              :treeData="treeData"
              @change="$emit('treeChange', $event)"
              v-decorator="[
                'pid',
                {
                  rules: [{ required: true, message: '请选择所属组别!' }]
                }
              ]"
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-show="form.getFieldValue('pid') && form.getFieldValue('type') == 'action'">
          <a-form-item label="按钮配置">
            <a-radio-group
              v-decorator="[
                'action_type',
                {
                  rules: [{ required: form.getFieldValue('type') == 'action', message: '请选择按钮配置!' }],
                  initialValue: 0
                }
              ]"
            >
              <a-radio-button :value="1">默认配置</a-radio-button>
              <a-radio-button :value="2">自定义</a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-show="form.getFieldValue('action_type') == 1 && form.getFieldValue('pid') && form.getFieldValue('type') === 'action'">
          <a-form-item label="按钮类型">
            <a-select
              style="min-width: 184px"
              placeholder="选择按钮类型"
              @change="handleButtonTypeChange"
              v-decorator="[
                'button_type',
                {
                  rules: [{ required: form.getFieldValue('type') === 'action' && form.getFieldValue('action_type') == 1, message: '请选择按钮类型!' }]
                }
              ]"
            >
              <a-select-option :value="item.key" v-for="(item, key) in $enum()" :key="key">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-show="form.getFieldValue('pid')">
          <a-form-item label="菜单标题" hasFeedback>
            <a-input
              placeholder="菜单标题"
              v-decorator="[
                'title',
                {
                  rules: [{ required: true, message: '请输入菜单标题!' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12" v-show="form.getFieldValue('pid')">
          <a-form-item label="权限标识" hasFeedback>
            <a-input
              placeholder="唯一识别码"
              v-decorator="[
                'name',
                {
                  rules: [{ required: true, message: '请输入唯一识别码!' }]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :span="24" v-show="form.getFieldValue('pid')">
          <a-col :span="12">
            <a-form-item v-if="form.getFieldValue('type') !== 'action'" label="组件地址">
              <a-select
                style="width: 184px"
                v-decorator="[
                  'component',
                  {
                    rules: [{ required: form.getFieldValue('type') !== 'action', message: '请选择组件!' }]
                  }
                ]">
                >
                <a-select-opt-group v-for="(list, type) in Components" :key="type" :label="type">
                  <a-select-option :value="name" v-for="(item, name) in list" :key="name">{{ name }}</a-select-option>
                </a-select-opt-group>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="form.getFieldValue('type') !== 'action'">
            <a-form-item label="路由地址" hasFeedback>
              <a-input
                placeholder="路由地址"
                v-decorator="[
                  'path',
                  {
                    rules: [{ required: form.getFieldValue('type') !== 'action', message: '请填写路由地址!' }]
                  }
                ]"
              />
            </a-form-item>
          </a-col>
        </a-col>
        <a-col :span="24">
          <a-form-item v-show="form.getFieldValue('type') === 'path'" label="Redirect">
            <a-input
              v-decorator="[
                'redirect',
                {
                  rules: [{ required: form.getFieldValue('type') === 'path', message: '请重定向地址!' }]
                }
              ]"
            >
            </a-input>
          </a-form-item>
        </a-col>

        <a-col :span="24" v-show="form.getFieldValue('pid')">
          <a-col :span="12">
            <a-form-item label="菜单状态">
              <a-radio-group
                v-decorator="[
                  'status',
                  {
                    rules: [{ required: true, message: '请选择菜单状态!' }],
                    initialValue: 1
                  }
                ]"
              >
                <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">{{ type.label }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="form.getFieldValue('type') !== 'action'">
            <a-form-item label="菜单缓存">
              <a-radio-group
                v-decorator="[
                  'keepAlive',
                  {
                    rules: [{ required: true, message: '请选择菜单缓存!' }],
                    initialValue: 0
                  }
                ]"
              >
                <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">{{ type.label }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="12" v-if="form.getFieldValue('type') !== 'action'">
            <a-form-item label="菜单隐藏">
              <a-radio-group
                v-decorator="[
                  'hidden',
                  {
                    rules: [{ required: true, message: '请选择菜单可见!' }],
                    initialValue: 0
                  }
                ]"
              >
                <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">
                  {{ type.label }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="form.getFieldValue('type') !== 'action'">
            <a-form-item label="隐藏子菜单">
              <a-radio-group
                v-decorator="[
                  'hideChildrenInMenu',
                  {
                    rules: [{ required: true, message: '请选择隐藏子菜单!' }],
                    initialValue: 0
                  }
                ]"
              >
                <a-radio-button :key="key" :value="type.value" v-for="(type, key) in status">{{ type.label }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-col>

        <a-col :span="12" v-if="form.getFieldValue('type') !== 'action'" >
          <a-form-item label="Permission">
            <a-select
              style="min-width: 184px"
              mode="tags"
              placeholder="Permission"
              v-decorator="[
                'permission'
              ]"
            >
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12" v-if="form.getFieldValue('type') !== 'action'" >
          <a-form-item label="菜单图标">
            <a-input
              slot="default"
              style="width: 184px;"
              v-decorator="[
                'icon'
              ]">
              <a-icon slot="prefix" type="search" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import { Components } from '@/config/componentConfigs'

export default {
  props: {
    selected: {
      type: Number,
      default: 0
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    status: {
      type: Array,
      default: () => {
        return []
      }
    },
    typeMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    confirmLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      Components
    }
  },
  created () {
    this.form = this.$form.createForm(this, { name: 'permission_from' })
  },
  methods: {
    handleButtonTypeChange (v) {
      const pid = this.form.getFieldValue('pid')
      const temp = (data, target) => {
        let result = null
        for (const i in data) {
          if (data[i].id.toString() === target) {
            result = data[i]
            break
          }
          if (result === null && data[i].children) {
            result = temp(data[i].children, target)
          }
        }

        return result
      }
      const t = temp(this.treeData, pid)
      this.form.setFieldsValue({
        title: this.$enum()[v].label,
        name: v + t.name
      })
    }
  }
}
</script>

<style scoped>
.ant-form-inline .ant-form-item {
    display: inline-block;
    margin-right: 16px;
    margin-bottom: 18px;
}
</style>
