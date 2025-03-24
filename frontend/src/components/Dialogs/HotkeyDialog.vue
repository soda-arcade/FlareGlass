  <template>
      <div v-if="active" class="modal-overlay">
          <div class="modal-container">
              <div class="modal window raised">
                  <div class="window-content">
                      <div class="window-header font-primary">
                          Custom Hotkey
                      </div>
                      <div class="window-body font-primary">
                          Press some modifier keys and a key to set a custom hotkey.
                          <div v-if="modifiers.length > 0" class="form-help">
                            {{ hotkeyString }}
                          </div>
                      </div>
                      <div class="window-footer font-primary">
                          <div class="btn btn-secondary" @click="close">Cancel</div>
                          <div v-if="canSet" class="btn btn-primary" @click="confirm">Set</div>
                      </div>
                  </div>

                  <div class="modal-close">
                      <div class="btn btn-round" @click="close">
                          <i class="fas fa-times"></i>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </template>
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
      name: 'HotkeyDialog',
      data() {
          return {
              active: false,
              modifiers: [] as number[],
              key: -1
          }
      },
      computed: {
          hotkeyString() {
              if (this.key === -1) {
                  return this.modifiers.map((m: number) => this.$app.helpers.getKeyName(m)).join(' + ');
              }
              return this.modifiers.map((m: number) => this.$app.helpers.getKeyName(m)).join(' + ') + ' + ' + this.$app.helpers.getKeyName(this.key);
          },
          canSet() {
            return this.key !== -1 && this.modifiers.length > 0;
          }
      },
      methods: {
        close() {
          this.$emit('cancel');
          this.active = false;
        },
        confirm() {
          this.$emit('confirm');

          this.active = false;
        },
        open() {
          this.modifiers = [];
          this.key = -1;
          this.active = true;
        },
        onKeydown(e: KeyboardEvent) {
          if (!this.active) return;

          e.preventDefault();

          if (e.key === 'Escape') {
            this.close();
            return;
          }
          if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') {
            if (!this.modifiers.includes(e.keyCode)) {
              this.modifiers.push(e.keyCode);
            }
          } else {
            this.key = e.keyCode;
          }
        },
      },
      mounted() {
        
        // Listen for keydown events
        window.addEventListener('keydown', this.onKeydown);

      },
      beforeUnmount() {
        window.removeEventListener('keydown', this.onKeydown);
      }
  });
</script>
<style lang="scss" scoped>
  .modal-overlay {
      background: rgba(0, 0, 0, 0.2);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .modal-container {
      width: 100%;
      height: 100%;
      max-height: 220px;
      max-width: 400px;
  }

  .modal {
      width: 100%;
      height: 100%;
      position: relative;

      &.has-sidebar {
          display: flex;

          .modal-content {
              flex: 1;
          }
      }

      .modal-close {
          position: absolute;
          top: -12px;
          right: -12px;
          cursor: pointer;
      }
  }

.form-help {
  color: $color-tertiary;
  margin-top: 0.25rem;
}
</style>