<template>
  <a-modal
    :width="width"
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="$emit('cancel')"
  >
    <div class="picture-space">
      <a-menu
        style="width: 150px"
        :default-selected-keys="defaultSelectKeys"
        :open-keys.sync="openKeys"
        :mode="mode"
        @click="handleClick"
      >
        <a-menu-item :key="menu.id" v-for="menu in menus">
          {{ menu.name }}
        </a-menu-item>
      </a-menu>

      <div class="image-contraniner">
        <a-spin :spinning="spinning">
          <a-list :grid="{ gutter: 16 }" :pagination="pagination" :data-source="listData" >
            <a-list-item slot="renderItem" slot-scope="item">
              <div class="image-item" @click="handleChange(item)">
                <div class="img-cover" :style="{ backgroundImage: `url(${item.content})`}" />
                <p class="file-name">{{ item.name }}</p>
                <div class="select-mask" v-show="selected === item.id">
                  <a-icon type="check" />
                </div>
              </div>
            </a-list-item>
          </a-list>
        </a-spin>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '850px'
    },
    title: {
      type: String,
      default: '图片库'
    },
    menus: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultSelectKeys: {
      type: Array,
      default: () => {
        return []
      }
    },
    mode: {
      type: String,
      default: 'inline'
    },
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      openKeys: [],
      loadingDir: false,
      pagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 10
      },
      actions: [
        { type: 'star-o', text: '156' },
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' }
      ],
      spinning: false,
      selected: null,
      row: {}
    }
  },
  methods: {
    handleClick ({ key }) {
      this.$emit('click', key)
    },
    resetChangeData () {
      this.selected = null
      this.row = {}
    },
    handleChange (row) {
      if (row.id === this.selected) {
        this.resetChangeData()
      } else {
        this.selected = row.id
        this.row = row
      }
    },
    handleOk () {
      this.$emit('ok', { key: this.selected, row: this.row })
      this.resetChangeData()
    }
  }
}
</script>

<style>
.picture-space {
  display: flex;
}
.image-contraniner {
  padding: 16px;
  flex: 1;
  background:#fff
}
.img-cover {
  width: 120px;
  height: 120px;
  display: block;
  background-size: cover;
  background-position: center center;
}
.file-name {
  margin: 5px 0 0 0;
  width: 120px;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.change {
  border: 2px #0cf dashed;
}
.image-item {
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  cursor: pointer;
  padding: 10px;
  transition: All 0.2s ease-in-out;
  position: relative;
}
.ant-row {
  display: flex;
  flex-wrap: wrap;
}
.image-item:hover {
  border: 1px solid #16bce2;
}
.select-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  border-radius: 6px;
  color:#fff;
  font-size: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
