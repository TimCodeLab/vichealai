<template>
  <ion-page>
    <ion-header class="pg-header">
      <div class="pg-bar">
        <button class="pg-back" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="pg-title">{{ t('nav.finance') }}</span>
        <button class="pg-new" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
          {{ t('finance.addFee') }}
        </button>
      </div>
    </ion-header>

    <ion-content style="--background:#f5f7fa">
      <div class="pg-body anim-fade-up">

        <!-- Hero summary card -->
        <div class="hero-card">
          <div class="hero-top">
            <div>
              <div class="hero-lbl">{{ t('finance.totalFees') }}</div>
              <div class="hero-amount">${{ totalFees.toFixed(2) }}</div>
            </div>
            <div class="hero-icon">💰</div>
          </div>
          <div class="hero-progress-wrap">
            <div class="hero-progress-bar">
              <div class="hero-progress-fill" :style="{ width: collectedPct + '%' }"></div>
            </div>
            <div class="hero-progress-lbl">{{ collectedPct }}% {{ t('finance.collectedPct') }}</div>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-val hero-green">${{ totalCollected.toFixed(2) }}</div>
              <div class="hero-stat-lbl">{{ t('finance.collected') }}</div>
            </div>
            <div class="hero-divider"></div>
            <div class="hero-stat">
              <div class="hero-stat-val hero-orange">${{ totalOutstanding.toFixed(2) }}</div>
              <div class="hero-stat-lbl">{{ t('finance.outstanding') }}</div>
            </div>
            <div class="hero-divider"></div>
            <div class="hero-stat">
              <div class="hero-stat-val hero-blue">{{ fees.length }}</div>
              <div class="hero-stat-lbl">{{ t('finance.feeTypes') }}</div>
            </div>
          </div>
        </div>

        <!-- Quick action tabs -->
        <div class="tab-row">
          <button v-for="tab in tabs" :key="tab.val" class="tab-btn" :class="{ active: activeTab === tab.val }" @click="activeTab = tab.val">
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- Fee list -->
        <div v-if="activeTab === 'fees'">
          <div class="sec-head">
            <span class="sec-title">{{ t('finance.feeStructure') }}</span>
            <span class="sec-count">{{ fees.length }} {{ t('finance.items') }}</span>
          </div>

          <div v-if="fees.length === 0" class="pg-empty">
            <div style="font-size:52px;margin-bottom:12px">💸</div>
            <div style="font-size:16px;font-weight:600;color:#374151">{{ t('finance.noFees') }}</div>
            <div style="font-size:13px;color:#9ca3af;margin-top:4px">{{ t('finance.noFeesSub') }}</div>
            <button class="pg-empty-btn" @click="openCreate">+ {{ t('finance.addFee') }}</button>
          </div>

          <div v-for="fee in fees" :key="fee.id" class="fee-card">
            <div class="fee-icon-wrap" :style="{ background: feeColor(fee.name) }">
              {{ feeEmoji(fee.category) }}
            </div>
            <div class="fee-info">
              <div class="fee-name">{{ fee.name }}</div>
              <div class="fee-desc" v-if="fee.description">{{ fee.description }}</div>
              <div class="fee-meta-row">
                <span class="fee-meta">📅 {{ fmtDate(fee.dueDate) }}</span>
                <span class="fee-badge" :class="statusBadge(fee.status)">{{ t('finance.' + (fee.status || 'pending')) }}</span>
              </div>
            </div>
            <div class="fee-right">
              <div class="fee-amount">{{ fee.currency || '$' }}{{ fee.amount }}</div>
              <div class="fee-acts">
                <button class="fa-btn fa-edit" @click="editItem(fee)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <button class="fa-btn fa-del" @click="deleteItem(fee.id)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments tab -->
        <div v-if="activeTab === 'payments'">
          <div class="sec-head">
            <span class="sec-title">{{ t('finance.paymentRecords') }}</span>
            <button class="sec-add" @click="openPayment">+ {{ t('finance.record') }}</button>
          </div>

          <div v-if="payments.length === 0" class="pg-empty">
            <div style="font-size:52px;margin-bottom:12px">🧾</div>
            <div style="font-size:16px;font-weight:600;color:#374151">{{ t('finance.noPayments') }}</div>
            <button class="pg-empty-btn" @click="openPayment">+ {{ t('finance.recordPay') }}</button>
          </div>

          <div v-for="pay in payments" :key="pay.id" class="pay-card">
            <div class="pay-avatar" :style="{ background: payColor(pay.studentName) }">
              {{ (pay.studentName||'?').charAt(0).toUpperCase() }}
            </div>
            <div class="pay-info">
              <div class="pay-name">{{ pay.studentName || t('finance.unknownStudent') }}</div>
              <div class="pay-fee">{{ pay.feeName }}</div>
              <div class="pay-date">{{ fmtDate(pay.date) }} · {{ pay.method || t('finance.cash') }}</div>
            </div>
            <div class="pay-right">
              <div class="pay-amount">+${{ pay.amount }}</div>
              <span class="pay-badge">{{ t('finance.paid') }}</span>
            </div>
          </div>
        </div>

        <!-- Analytics tab -->
        <div v-if="activeTab === 'analytics'">
          <div class="sec-head"><span class="sec-title">{{ t('finance.collectionSummary') }}</span></div>

          <div class="analytics-grid">
            <div class="an-card an-blue">
              <div class="an-icon">📊</div>
              <div class="an-val">${{ totalFees.toFixed(0) }}</div>
              <div class="an-lbl">{{ t('finance.totalBilled') }}</div>
            </div>
            <div class="an-card an-green">
              <div class="an-icon">✅</div>
              <div class="an-val">${{ totalCollected.toFixed(0) }}</div>
              <div class="an-lbl">{{ t('finance.collected') }}</div>
            </div>
            <div class="an-card an-orange">
              <div class="an-icon">⏳</div>
              <div class="an-val">${{ totalOutstanding.toFixed(0) }}</div>
              <div class="an-lbl">{{ t('finance.outstanding') }}</div>
            </div>
            <div class="an-card an-purple">
              <div class="an-icon">💳</div>
              <div class="an-val">{{ payments.length }}</div>
              <div class="an-lbl">{{ t('finance.transactions') }}</div>
            </div>
          </div>

          <!-- Per-fee breakdown -->
          <div class="breakdown-card">
            <div class="breakdown-title">{{ t('finance.feeBreakdown') }}</div>
            <div v-if="fees.length === 0" style="text-align:center;padding:24px;color:#9ca3af;font-size:13px">{{ t('finance.noFeeAnalyze') }}</div>
            <div v-for="fee in fees" :key="fee.id" class="breakdown-row">
              <div class="breakdown-left">
                <span class="breakdown-name">{{ fee.name }}</span>
                <div class="breakdown-bar-wrap">
                  <div class="breakdown-bar">
                    <div class="breakdown-fill" :style="{ width: (fee.amount / (totalFees || 1) * 100) + '%' }"></div>
                  </div>
                </div>
              </div>
              <span class="breakdown-amt">${{ fee.amount }}</span>
            </div>
          </div>
        </div>

        <div style="height:28px"></div>
      </div>
    </ion-content>

    <!-- Add/Edit Fee Modal -->
    <ion-modal :is-open="showModal" @did-dismiss="closeModal">
      <div class="mo-wrap">
        <div class="mo-handle"></div>
        <div class="mo-head">
          <span class="mo-title">{{ editing ? '✏️ ' + t('finance.editFee') : '➕ ' + t('finance.newFee') }}</span>
          <button class="mo-close" @click="closeModal">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field"><label class="mo-label">{{ t('finance.feeName') }} *</label><input v-model="form.name" class="mo-input" placeholder="e.g. Tuition Fee" /></div>
          <div class="mo-field"><label class="mo-label">{{ t('forms.description') }}</label><input v-model="form.description" class="mo-input" placeholder="Optional" /></div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('finance.amount') }}</label>
              <input v-model="form.amount" type="number" class="mo-input" placeholder="0.00" />
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('finance.currency') }}</label>
              <select v-model="form.currency" class="mo-input">
                <option value="$">USD ($)</option>
                <option value="KHR">KHR (រ)</option>
              </select>
            </div>
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('finance.category') }}</label>
              <select v-model="form.category" class="mo-input">
                <option value="tuition">{{ t('finance.tuition') }}</option>
                <option value="activity">{{ t('finance.activity') }}</option>
                <option value="library">{{ t('finance.library') }}</option>
                <option value="transport">{{ t('finance.transport') }}</option>
                <option value="exam">{{ t('finance.exam') }}</option>
                <option value="other">{{ t('finance.other') }}</option>
              </select>
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('finance.status') }}</label>
              <select v-model="form.status" class="mo-input">
                <option value="active">{{ t('finance.active') }}</option>
                <option value="pending">{{ t('finance.pending') }}</option>
                <option value="inactive">{{ t('finance.inactive') }}</option>
              </select>
            </div>
          </div>
          <div class="mo-field"><label class="mo-label">{{ t('finance.dueDate') }}</label><input v-model="form.dueDate" type="date" class="mo-input" /></div>
          <div class="mo-btns">
            <button class="mo-cancel" @click="closeModal">{{ t('actions.cancel') }}</button>
            <button class="mo-save" @click="saveItem" :disabled="!form.name">{{ t('finance.saveFee') }}</button>
          </div>
        </div>
      </div>
    </ion-modal>

    <!-- Record Payment Modal -->
    <ion-modal :is-open="showPayModal" @did-dismiss="showPayModal = false">
      <div class="mo-wrap">
        <div class="mo-handle"></div>
        <div class="mo-head">
          <span class="mo-title">🧾 {{ t('finance.recordPay') }}</span>
          <button class="mo-close" @click="showPayModal = false">✕</button>
        </div>
        <div class="mo-body">
          <div class="mo-field">
            <label class="mo-label">{{ t('finance.studentName') }}</label>
            <input v-model="payForm.studentName" class="mo-input" placeholder="Student name" />
          </div>
          <div class="mo-field">
            <label class="mo-label">{{ t('finance.fees') }}</label>
            <select v-model="payForm.feeName" class="mo-input">
              <option value="">-- {{ t('finance.selectFee') }} --</option>
              <option v-for="f in fees" :key="f.id" :value="f.name">{{ f.name }}</option>
            </select>
          </div>
          <div class="mo-row2">
            <div class="mo-field">
              <label class="mo-label">{{ t('finance.amount') }}</label>
              <input v-model="payForm.amount" type="number" class="mo-input" placeholder="0.00" />
            </div>
            <div class="mo-field">
              <label class="mo-label">{{ t('finance.method') }}</label>
              <select v-model="payForm.method" class="mo-input">
                <option value="Cash">{{ t('finance.cash') }}</option>
                <option value="Bank Transfer">{{ t('finance.bankTransfer') }}</option>
                <option value="ABA">ABA</option>
                <option value="Wing">Wing</option>
              </select>
            </div>
          </div>
          <div class="mo-field"><label class="mo-label">{{ t('forms.date') }}</label><input v-model="payForm.date" type="date" class="mo-input" /></div>
          <div class="mo-btns">
            <button class="mo-cancel" @click="showPayModal = false">{{ t('actions.cancel') }}</button>
            <button class="mo-save" @click="savePayment" :disabled="!payForm.studentName || !payForm.amount">{{ t('finance.savePayment') }}</button>
          </div>
        </div>
      </div>
    </ion-modal>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </transition>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IonPage, IonHeader, IonContent, IonModal } from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { LocalStorageService } from '@/services/localStorageService'

const router = useRouter()
const { t } = useI18n()

const fees     = ref<any[]>(LocalStorageService.get<any[]>('fees',     []) || [])
const payments = ref<any[]>(LocalStorageService.get<any[]>('payments', []) || [])
const activeTab  = ref('fees')
const showModal  = ref(false)
const showPayModal = ref(false)
const editing    = ref<any>(null)
const toastMsg   = ref('')

const form = ref({ name:'', description:'', amount:0, currency:'$', category:'tuition', status:'active', dueDate:'' })
const payForm = ref({ studentName:'', feeName:'', amount:0, method:'Cash', date:new Date().toISOString().split('T')[0] })

const tabs = computed(() => [
  { val:'fees',      icon:'💳', label: t('finance.fees')      },
  { val:'payments',  icon:'🧾', label: t('finance.payments')  },
  { val:'analytics', icon:'📊', label: t('finance.analytics') },
])

const totalFees        = computed(() => fees.value.reduce((s,f)=>s+Number(f.amount||0),0))
const totalCollected   = computed(() => payments.value.reduce((s,p)=>s+Number(p.amount||0),0))
const totalOutstanding = computed(() => Math.max(0, totalFees.value - totalCollected.value))
const collectedPct     = computed(() => totalFees.value ? Math.min(100, Math.round(totalCollected.value/totalFees.value*100)) : 0)

const palette = ['#1976d2','#2e7d32','#e65100','#6a1b9a','#c62828','#00838f','#4527a0','#558b2f']
function feeColor(n: string)  { return palette[(n?.charCodeAt(0)||0) % palette.length] }
function payColor(n: string)  { return palette[(n?.charCodeAt(0)||0) % palette.length] }
function feeEmoji(cat: string) {
  return ({tuition:'🎓',activity:'⚽',library:'📚',transport:'🚌',exam:'📝',other:'💰'} as any)[cat] || '💳'
}
function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString() : '—' }
function statusBadge(s: string) {
  return ({active:'badge-green',pending:'badge-orange',inactive:'badge-gray'} as any)[s] || 'badge-gray'
}

function showToast(msg: string) { toastMsg.value=msg; setTimeout(()=>toastMsg.value='',2500) }

function openCreate() { form.value={name:'',description:'',amount:0,currency:'$',category:'tuition',status:'active',dueDate:''}; editing.value=null; showModal.value=true }
function editItem(f: any) { editing.value=f; form.value={...f}; showModal.value=true }
function closeModal()     { showModal.value=false; editing.value=null }
function openPayment()    { payForm.value={studentName:'',feeName:'',amount:0,method:'Cash',date:new Date().toISOString().split('T')[0]}; showPayModal.value=true }

function deleteItem(id: string) {
  if (confirm(t('finance.deleteFee'))) { fees.value=fees.value.filter(f=>f.id!==id); LocalStorageService.set('fees',fees.value); showToast(t('messages.deletedSuccessfully')) }
}
function saveItem() {
  if (!form.value.name) return
  const wasEditing = editing.value
  if (editing.value) {
    const i=fees.value.findIndex(f=>f.id===editing.value.id)
    if (i!==-1) fees.value[i]={...fees.value[i],...form.value}
  } else {
    fees.value.push({id:`fee_${Date.now()}`,schoolId:'school_1',...form.value})
  }
  LocalStorageService.set('fees',fees.value); closeModal(); showToast(wasEditing ? t('messages.updatedSuccessfully') : t('messages.createdSuccessfully'))
}
function savePayment() {
  if (!payForm.value.studentName || !payForm.value.amount) return
  payments.value.unshift({id:`pay_${Date.now()}`,...payForm.value})
  LocalStorageService.set('payments',payments.value); showPayModal.value=false; showToast(t('finance.paymentRecorded'))
}
</script>

<style scoped>
/* Header */
.pg-header { background: linear-gradient(135deg,#1565c0 0%,#1976d2 45%,#0288d1 100%); box-shadow:0 4px 20px rgba(21,101,192,.4); }
.pg-bar    { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; height:56px; }
.pg-back   { width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.18); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.pg-title  { font-size:17px; font-weight:700; color:white; letter-spacing:.3px; }
.pg-new    { display:flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35); border-radius:20px; color:white; font-size:13px; font-weight:600; cursor:pointer; }

/* Body */
.pg-body { padding:14px; }
.pg-empty { text-align:center; padding:50px 20px 30px; }
.pg-empty-btn { margin-top:16px; padding:10px 24px; background:#1976d2; color:white; border:none; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; }

/* Hero card */
.hero-card   { background:linear-gradient(135deg,#1565c0 0%,#1976d2 50%,#0288d1 100%); border-radius:20px; padding:20px; margin-bottom:14px; box-shadow:0 6px 24px rgba(21,101,192,.35); }
.hero-top    { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
.hero-lbl    { font-size:12px; font-weight:600; color:rgba(255,255,255,.75); margin-bottom:4px; }
.hero-amount { font-size:32px; font-weight:800; color:white; letter-spacing:-1px; }
.hero-icon   { font-size:36px; opacity:.85; }
.hero-progress-wrap { margin-bottom:16px; }
.hero-progress-bar  { height:8px; background:rgba(255,255,255,.25); border-radius:4px; overflow:hidden; margin-bottom:5px; }
.hero-progress-fill { height:100%; background:white; border-radius:4px; transition:width .5s ease; }
.hero-progress-lbl  { font-size:11px; color:rgba(255,255,255,.8); font-weight:600; }
.hero-stats  { display:grid; grid-template-columns:1fr auto 1fr auto 1fr; align-items:center; background:rgba(255,255,255,.12); border-radius:12px; padding:12px 8px; }
.hero-stat   { text-align:center; }
.hero-stat-val { font-size:17px; font-weight:800; }
.hero-stat-lbl { font-size:10px; color:rgba(255,255,255,.75); font-weight:600; margin-top:2px; }
.hero-green    { color:#86efac; }
.hero-orange   { color:#fdba74; }
.hero-blue     { color:#bae6fd; }
.hero-divider  { width:1px; height:32px; background:rgba(255,255,255,.2); }

/* Tabs */
.tab-row { display:flex; gap:6px; margin-bottom:14px; overflow-x:auto; padding-bottom:2px; }
.tab-btn { padding:7px 14px; border-radius:20px; border:1.5px solid #e5e7eb; background:white; font-size:12px; font-weight:600; color:#6b7280; cursor:pointer; white-space:nowrap; box-shadow:0 1px 3px rgba(0,0,0,.05); }
.tab-btn.active { background:#1976d2; border-color:#1976d2; color:white; }

/* Section */
.sec-head  { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.sec-title { font-size:13px; font-weight:700; color:#374151; text-transform:uppercase; letter-spacing:.5px; }
.sec-count { font-size:11px; font-weight:600; color:#9ca3af; }
.sec-add   { font-size:12px; font-weight:700; color:#1976d2; background:none; border:none; cursor:pointer; }

/* Fee card */
.fee-card  { display:flex; align-items:center; gap:12px; background:white; border-radius:14px; padding:13px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.fee-icon-wrap { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.fee-info  { flex:1; min-width:0; }
.fee-name  { font-size:14px; font-weight:700; color:#1f2937; margin-bottom:2px; }
.fee-desc  { font-size:12px; color:#6b7280; margin-bottom:4px; }
.fee-meta-row { display:flex; align-items:center; gap:8px; }
.fee-meta  { font-size:11px; color:#9ca3af; }
.fee-badge { font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; text-transform:capitalize; }
.badge-green  { background:#dcfce7; color:#16a34a; }
.badge-orange { background:#ffedd5; color:#c2410c; }
.badge-gray   { background:#f3f4f6; color:#6b7280; }
.fee-right { text-align:right; flex-shrink:0; }
.fee-amount { font-size:16px; font-weight:800; color:#1f2937; margin-bottom:6px; }
.fee-acts  { display:flex; gap:5px; justify-content:flex-end; }
.fa-btn    { width:28px; height:28px; border-radius:7px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; }
.fa-edit   { background:#eff6ff; color:#1976d2; }
.fa-del    { background:#fff5f5; color:#ef4444; }

/* Payment card */
.pay-card  { display:flex; align-items:center; gap:12px; background:white; border-radius:14px; padding:13px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.pay-avatar { width:42px; height:42px; border-radius:50%; color:white; font-size:18px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.pay-info  { flex:1; min-width:0; }
.pay-name  { font-size:14px; font-weight:700; color:#1f2937; }
.pay-fee   { font-size:12px; color:#6b7280; margin:1px 0; }
.pay-date  { font-size:11px; color:#9ca3af; }
.pay-right { text-align:right; flex-shrink:0; }
.pay-amount { font-size:16px; font-weight:800; color:#16a34a; }
.pay-badge  { font-size:10px; font-weight:700; background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:20px; display:block; margin-top:4px; text-align:center; }

/* Analytics */
.analytics-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
.an-card   { border-radius:14px; padding:16px 14px; box-shadow:0 3px 12px rgba(0,0,0,.1); }
.an-blue   { background:linear-gradient(135deg,#1565c0,#1976d2); }
.an-green  { background:linear-gradient(135deg,#2e7d32,#43a047); }
.an-orange { background:linear-gradient(135deg,#e65100,#f57c00); }
.an-purple { background:linear-gradient(135deg,#6a1b9a,#8e24aa); }
.an-icon   { font-size:22px; margin-bottom:6px; }
.an-val    { font-size:22px; font-weight:800; color:white; }
.an-lbl    { font-size:11px; font-weight:600; color:rgba(255,255,255,.8); margin-top:2px; }

/* Breakdown */
.breakdown-card  { background:white; border-radius:14px; padding:16px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.breakdown-title { font-size:13px; font-weight:700; color:#374151; margin-bottom:12px; }
.breakdown-row   { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.breakdown-row:last-child { margin-bottom:0; }
.breakdown-left  { flex:1; min-width:0; }
.breakdown-name  { font-size:12px; font-weight:600; color:#374151; display:block; margin-bottom:4px; }
.breakdown-bar-wrap { width:100%; }
.breakdown-bar   { height:6px; background:#f3f4f6; border-radius:3px; overflow:hidden; }
.breakdown-fill  { height:100%; background:linear-gradient(90deg,#1976d2,#0288d1); border-radius:3px; transition:width .4s ease; min-width:4px; }
.breakdown-amt   { font-size:13px; font-weight:700; color:#1f2937; flex-shrink:0; }

/* Modal */
ion-modal  { --border-radius:20px 20px 0 0; --max-height:90vh; align-items:flex-end; }
.mo-wrap   { background:white; border-radius:20px 20px 0 0; display:flex; flex-direction:column; max-height:90vh; }
.mo-handle { width:36px; height:4px; border-radius:2px; background:#e5e7eb; margin:12px auto 0; }
.mo-head   { display:flex; align-items:center; justify-content:space-between; padding:14px 18px 10px; border-bottom:1px solid #f3f4f6; }
.mo-title  { font-size:16px; font-weight:700; color:#1f2937; }
.mo-close  { width:30px; height:30px; border-radius:50%; background:#f3f4f6; border:none; cursor:pointer; font-size:13px; color:#6b7280; }
.mo-body   { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
.mo-field  { display:flex; flex-direction:column; gap:5px; }
.mo-row2   { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.mo-label  { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:.5px; }
.mo-input  { width:100%; padding:11px 13px; border:1.5px solid #e5e7eb; border-radius:10px; font-size:14px; color:#1f2937; background:#f9fafb; outline:none; box-sizing:border-box; }
.mo-input:focus { border-color:#1976d2; background:white; }
.mo-btns   { display:flex; gap:10px; padding-top:4px; }
.mo-cancel { flex:1; padding:13px; background:#f3f4f6; color:#374151; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save   { flex:2; padding:13px; background:linear-gradient(135deg,#1565c0,#1976d2); color:white; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; }
.mo-save:disabled { opacity:.45; cursor:default; }

/* Toast */
.toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:#1f2937; color:white; padding:11px 20px; border-radius:24px; font-size:13px; font-weight:600; z-index:9999; white-space:nowrap; box-shadow:0 4px 20px rgba(0,0,0,.2); }
.toast-enter-active, .toast-leave-active { transition: all .25s; }
.toast-enter-from, .toast-leave-to { opacity:0; transform:translateX(-50%) translateY(12px); }
.fee-card { animation: fadeUp .35s ease both; }
.fee-card:nth-child(1){animation-delay:.05s}.fee-card:nth-child(2){animation-delay:.10s}.fee-card:nth-child(3){animation-delay:.15s}.fee-card:nth-child(4){animation-delay:.20s}.fee-card:nth-child(5){animation-delay:.25s}
.an-card { animation: fadeUp .3s ease both; }
.an-card:nth-child(1){animation-delay:.05s}.an-card:nth-child(2){animation-delay:.10s}.an-card:nth-child(3){animation-delay:.15s}.an-card:nth-child(4){animation-delay:.20s}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
</style>
