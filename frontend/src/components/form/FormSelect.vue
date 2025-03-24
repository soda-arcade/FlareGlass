<template>
    <div class="toggle-group">
        <label class="form-label">{{ label }}</label>
        <div class="form-select-wrapper">
            <div class="form-select-input" @click="toggleDropdown">
                <input type="text" :name="name" :value="getLabel(value)" readonly>
                <i v-if="!active" class="fas fa-caret-down"></i>
                <i v-else class="fas fa-caret-up"></i>
            </div>
            <div v-if="active" class="form-select-dropdown">
                <div
                v-for="option in options"
                :key="option.value"
                @click="$emit('oninput', option.value); active = false"
                :class="{ active: option.value === value }"
                class="form-select-option">
                    {{ option.label }}
                </div>
            </div>
            <div class="form-help">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

export default {
    name: 'FormSelect',
    props: {
        label: {
            type: [String, Number],
            default: 'Toggle',
        },
        value: {
            type: [String, Number],
            default: false,
        },
        name: {
            type: String,
            required: true,
        },
        options: {
            type: Array as () => {label: string, value: string}[],
            default: () => [],
        },
    },
    data() {
        return {
            active: false,
        };
    },
    computed: {
        
    },
    methods: {
        getLabel(value: string|number) {
            return this.options.find((option) => option.value === value)?.label || '';
        },
        toggleDropdown() {
            this.active = !this.active;
        },
        hideDropdown(e: Event) {
            if (!this.$el.contains(e.target)) {
                this.active = false;
            }
        },
    },
    mounted() {
        document.addEventListener('click', this.hideDropdown);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.hideDropdown);
    },
}
</script>
<style lang="scss" scoped>
.toggle-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.form-select-wrapper {
    position: relative;
    width: 100%;
}

.form-select-input {
    display: flex;
    align-items: center;
    background: $color-primary;
    border: solid 1px rgba(255, 255, 255, 0.2);
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;

    &.active {
        border-radius: 8px 8px 0 0;
    }

    &:hover {
        border: solid 1px lighten($color-quaternary, 10%);
    }

    input {
        cursor: pointer;
        flex: 1;
        color: $color-secondary;
        font-family: 'Roboto', sans-serif;
        user-select: none;
        outline: none;
        background: none;
        border: none;
    }
}

.form-select-dropdown {
    background: darken($color-primary, 2%);
    border: solid 1px rgba(255, 255, 255, 0.2);
    border-top: none;
    border-radius: 0 0 8px 8px;

    .form-select-option {
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        user-select: none;

        &:hover {
            background: lighten($color-primary, 2%);
        }

        &.active {
            background: linear-gradient(90deg, darken($color-quaternary, 10%), darken($color-quaternary, 5%));
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        &:last-child {
            border-radius: 0 0 8px 8px;
        }
    }
}

.form-help {
    color: $color-tertiary;
    margin-top: 0.25rem;
}
</style>