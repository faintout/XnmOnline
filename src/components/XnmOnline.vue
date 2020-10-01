<template>
  <div class="hello">
    <div class="top">
      <el-input v-model.trim="roomId" placeholder="请输入房间号" style="width:30%;margin-right:3%"></el-input>
      <el-button type="primary" @click="getUrl">播放</el-button>
    </div>
    <br />

    <el-button
      type="primary"
      v-show="isGetUrl"
      v-clipboard:copy="decUrl"
      v-clipboard:success="CopySuccess"
      v-clipboard:error="CopyError"
    >复制播放地址</el-button>
    <div id="decUrl">{{decUrl}}</div>
    <div class="video" style="width:50%;height:50%;margin:10% auto;">
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      ></video-player>
    </div>
  </div>
</template>
<script src="https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/crypto-js/3.1.2/components/aes.js"></script>
<script src="https://cdn.bootcss.com/zepto/1.1.5/zepto.min.js"></script>
<script>
import "videojs-flash";

export default {
  components: {},
  data() {
    return {
      //是否获取地址
      isGetUrl: false,
      //解密地址
      decUrl: "",
      roomId: "",
      //播放器配置
      playerOptions: {
        techOrder: ["flash", "html5"],
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "rtmp/flv",
            // type: "video/mp4", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            // type: "rtmp/flv", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "rtmp://58.200.131.2:1935/livetv/hunantv" //url地址,
            // src: 'rtmp://pull.2yjn.com/live/s1224556285_70e6882cd0?txSecret=c4ae8fdc27e99337d6db5479243f79f5&txTime=5f74b79d', //湖南台的直流地址
            // src: "rtmp://vod.0561rtv.com:1935/live/live4" //url地址
            // src: "https://v-cdn.zjol.com.cn/280123.mp4" //url地址
          }
        ],
        // techOrder: ['flash'],
        // poster: "../../static/images/test.jpg", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    CopySuccess(e) {
      this.$message.success("链接已复制到粘贴板");
    },
    CopyError() {
      this.$message.error("复制链接失败了呢");
    },
    //获取地址
    getUrl() {

      //解密密文字符串
      var decrypt_key = "00000000000000000000000000000000";
      var iv = "pk];pk,o876nkwdd";
      var decrypt_string = $("#val").val();
      let self = this;
      $.ajax({
        type: "GET",
        url: "/kawayi/hqlldzurl.php?dqfjh=" + self.roomId,
        success(res) {
          if (JSON.parse(res).data.data == "") {
            self.$message({ message: JSON.parse(res).message, type: "error" });
            // self.decUrl = "地址错误";
            return;
          }
          self.$message({ message: "地址获取成功！", type: "success" });
          self.isGetUrl = true;

          let decrypted_string = self.decCode(
            JSON.parse(res).data.data,
            decrypt_key,
            iv
          );
          //替换校验字符
          decrypted_string = decrypted_string
            .replace(/\u001a/g, ":")
            .replace(/\u000f/g, "/")
            .replace(/\u000e/g, ".")
            .replace(/\u0006/g, "")
            .replace(/\u0010/g, "")
            .replace(/\u0005/g, "");
          console.log(decrypted_string);

          self.decUrl = decrypted_string;
          self.playerOptions.sources[0].src = decrypted_string;
        },
        error(err) {
          self.$message({ message: '接口报废了,戒了把！', type: "error" });
        }
      });
    },
    //解密方法
    decCode(str, key, iv) {
      key = CryptoJS.enc.Hex.parse(key);
      iv = CryptoJS.enc.Utf8.parse(iv);
      let decrypted = CryptoJS.AES.decrypt(str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
  },
  mounted() {},
  created() {
    console.log('老哥，轻撸,身体要紧');
  }
};
</script>
<style scoped>
.video-js .vjs-icon-placeholder {
  width: 50%;
  height: 50%;
  display: block;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
