import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Save, Plus, Upload, Database, FileText, 
  CheckCircle, Users, UserCheck, Loader2, Download 
} from 'lucide-react';
import fileDownload from 'js-file-download';
import { utils } from './Dashboard';
import type { Creator, Account, Deal } from '../types';

// 编辑博主模态框
export function EditModal({ isOpen, onClose, creator, onSave, isNew }: {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator | null;
  onSave: (data: Creator) => void;
  isNew: boolean;
}) {
  const categoryOptions = [
    '美妆护肤', '美食探店', '穿搭美甲', '颜值', '舞蹈才艺', '摄影', 
    '母婴亲子', '泛生活Vlog', '运动健身', '科普资讯', '游戏二次元', '创业职场',
    '家居收纳', '情侣', '灵修塔罗', '搞笑', '汽车', '旅游',
    '手工DIY', '园艺', '新闻时政', '烹饪烘焙', '宠物', '吃播'
  ];

  const contractStatusOptions = [
    '已经签全约',
    '已经签商务约',
    '有全账号签约意向',
    '有商务约意向',
    '无签约意向',
    '有挂靠',
    '已有MCN'
  ];

  const [formData, setFormData] = useState<Creator>(
    creator || {
      id: utils.generateId(),
      realName: '',
      wechatName: '',
      contactMethod: '',
      city: '',
      inGroup: '',
      interviewStatus: '',
      interviewer: '',
      interviewDate: '',
      contractStatus: '',
      contractStartDate: '',
      contractEndDate: '',
      commission: 0.7,
      category: '',
      notes: '',
      transferAccount: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    if (creator) {
      setFormData(creator);
      // 解析多选的类别和状态
      if (creator.category) {
        const categories = creator.category.split(',').map(c => c.trim());
        setSelectedCategories(categories);
      }
      if (creator.contractStatus) {
        setSelectedStatuses(creator.contractStatus.split(',').map(s => s.trim()));
      }
    }
  }, [creator]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.id.trim()) newErrors.id = '请输入博主ID';
    if (!formData.realName.trim()) newErrors.realName = '请输入真实姓名';
    if (!formData.wechatName.trim()) newErrors.wechatName = '请输入微信名';
    if (!formData.city.trim()) newErrors.city = '请输入所在城市';
    if (selectedCategories.length === 0) newErrors.category = '请至少选择一个账号类别';
    if (formData.commission < 0 || formData.commission > 1) {
      newErrors.commission = '分成比例应在0-1之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        category: selectedCategories.join(', '),
        contractStatus: selectedStatuses.join(', ')
      };
      onSave(dataToSave);
    }
  };

  const handleChange = (field: keyof Creator, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !selectedCategories.includes(customCategory.trim())) {
      setSelectedCategories(prev => [...prev, customCategory.trim()]);
      setCustomCategory('');
      setShowCustomCategory(false);
      if (errors.category) {
        setErrors(prev => ({ ...prev, category: '' }));
      }
    }
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-content-morandi max-w-4xl">
        <ModalHeader
          icon={Users}
          title={isNew ? '新增博主' : '编辑博主信息'}
          subtitle={isNew ? '请填写博主的基本信息' : `编辑 ${formData.realName} 的信息`}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 基本信息 */}
            <FormField
              label="博主ID"
              error={errors.id}
              required
            >
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                className="input-morandi"
                placeholder="请输入博主ID"
                disabled={!isNew}
              />
              {!isNew && <p className="text-xs text-[var(--morandi-mist)] mt-1">博主ID创建后不可修改</p>}
            </FormField>

            <FormField
              label="真实姓名"
              error={errors.realName}
              required
            >
              <input
                type="text"
                value={formData.realName}
                onChange={(e) => handleChange('realName', e.target.value)}
                className="input-morandi"
                placeholder="请输入真实姓名"
              />
            </FormField>

            <FormField
              label="微信名"
              error={errors.wechatName}
              required
            >
              <input
                type="text"
                value={formData.wechatName}
                onChange={(e) => handleChange('wechatName', e.target.value)}
                className="input-morandi"
                placeholder="请输入微信名"
              />
            </FormField>

            <FormField
              label="所在城市"
              error={errors.city}
              required
            >
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="input-morandi"
                placeholder="请输入所在城市"
              />
            </FormField>

            <FormField label="联系方式">
              <input
                type="text"
                value={formData.contactMethod}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                className="input-morandi"
                placeholder="请输入联系方式"
              />
            </FormField>

            <FormField label="分成比例">
              <input
                type="number"
                value={formData.commission}
                onChange={(e) => handleChange('commission', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0.7"
                min="0"
                max="1"
                step="0.01"
              />
            </FormField>

            <FormField label="在DC商单群">
              <select
                value={formData.inGroup}
                onChange={(e) => handleChange('inGroup', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </FormField>

            <FormField label="面试情况">
              <select
                value={formData.interviewStatus}
                onChange={(e) => handleChange('interviewStatus', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择</option>
                <option value="已通过">已通过</option>
                <option value="未通过">未通过</option>
                <option value="待面试">待面试</option>
              </select>
            </FormField>

            <FormField label="面试人">
              <input
                type="text"
                value={formData.interviewer}
                onChange={(e) => handleChange('interviewer', e.target.value)}
                className="input-morandi"
                placeholder="请输入面试人"
              />
            </FormField>

            <FormField label="面试日期">
              <input
                type="date"
                value={formData.interviewDate}
                onChange={(e) => handleChange('interviewDate', e.target.value)}
                className="input-morandi"
              />
            </FormField>

            {/* 签约状态 - 多选 */}
            <FormField
              label="签约状态（多选）"
              className="md:col-span-2"
            >
              <div className="grid grid-cols-3 gap-2">
                {contractStatusOptions.map(status => (
                  <label key={status} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--morandi-pearl)]/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusToggle(status)}
                      className="rounded"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
              {selectedStatuses.length > 0 && (
                <p className="text-sm text-[var(--morandi-mist)] mt-2">
                  已选择: {selectedStatuses.join(', ')}
                </p>
              )}
            </FormField>

            <FormField label="合同开始日期">
              <input
                type="date"
                value={formData.contractStartDate}
                onChange={(e) => handleChange('contractStartDate', e.target.value)}
                className="input-morandi"
              />
            </FormField>

            <FormField label="合同结束日期">
              <input
                type="date"
                value={formData.contractEndDate}
                onChange={(e) => handleChange('contractEndDate', e.target.value)}
                className="input-morandi"
              />
            </FormField>

            {/* 账号类别 - 多选 */}
            <FormField
              label="账号类别（多选）"
              error={errors.category}
              required
              className="md:col-span-2"
            >
              <div className="grid grid-cols-4 gap-2 mb-4">
                {categoryOptions.map(category => (
                  <label key={category} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--morandi-pearl)]/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
              
              {!showCustomCategory && (
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className="btn-morandi-secondary text-sm"
                >
                  <Plus size={16} />
                  添加自定义类别
                </button>
              )}
              
              {showCustomCategory && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="input-morandi flex-1"
                    placeholder="输入自定义类别"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="btn-morandi-primary"
                  >
                    添加
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomCategory(false);
                      setCustomCategory('');
                    }}
                    className="btn-morandi-secondary"
                  >
                    取消
                  </button>
                </div>
              )}
              
              {selectedCategories.length > 0 && (
                <p className="text-sm text-[var(--morandi-mist)] mt-2">
                  已选择: {selectedCategories.join(', ')}
                </p>
              )}
            </FormField>

            <FormField label="备注" className="md:col-span-2">
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="input-morandi h-20 resize-none"
                placeholder="请输入备注信息..."
              />
            </FormField>

            <FormField label="转账账户信息" className="md:col-span-2">
              <input
                type="text"
                value={formData.transferAccount}
                onChange={(e) => handleChange('transferAccount', e.target.value)}
                className="input-morandi"
                placeholder="请输入转账账户信息"
              />
            </FormField>
          </div>

          <ModalFooter onCancel={onClose}>
            <button type="submit" className="btn-morandi-primary">
              <Save size={18} />
              {isNew ? '添加博主' : '保存修改'}
            </button>
          </ModalFooter>
        </form>
      </div>
    </ModalWrapper>
  );
}

// 业配模态框
export function DealModal({ isOpen, onClose, deal, onSave, creators, isNew }: {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (data: Deal) => void;
  creators: Creator[];
  isNew: boolean;
}) {
  const [formData, setFormData] = useState<Deal>(
    deal || {
      id: utils.generateId(),
      creatorId: '',
      partner: '',
      type: '',
      date: '',
      channel: '',
      amount: 0,
      transferCycle: '',
      transferDate: '',
      transferStatus: '待转账',
      receivedAmount: 0,
      companyShare: 0,
      creatorShare: 0,
      unallocated: '',
      informalDetails: ''
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (deal) {
      setFormData(deal);
    }
  }, [deal]);

  useEffect(() => {
    // 自动计算分成
    if (formData.amount && formData.creatorId) {
      const creator = creators.find(c => c.id === formData.creatorId);
      if (creator) {
        const { creatorShare, companyShare } = utils.calculateShares(formData.amount, creator.commission);
        setFormData(prev => ({ ...prev, creatorShare, companyShare }));
      }
    }
  }, [formData.amount, formData.creatorId, creators]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.creatorId) newErrors.creatorId = '请选择博主';
    if (!formData.partner.trim()) newErrors.partner = '请输入合作方';
    if (!formData.date) newErrors.date = '请选择业配日期';
    if (formData.amount <= 0) newErrors.amount = '请输入有效的金额';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Deal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-content-morandi max-w-4xl">
        <ModalHeader
          icon={FileText}
          title={isNew ? '新增业配记录' : '编辑业配记录'}
          subtitle={isNew ? '请填写业配相关信息' : '更新业配记录信息'}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              label="选择博主"
              error={errors.creatorId}
              required
            >
              <select
                value={formData.creatorId}
                onChange={(e) => handleChange('creatorId', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择博主</option>
                {creators.map(creator => (
                  <option key={creator.id} value={creator.id}>
                    {creator.id} - {creator.realName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="合作方"
              error={errors.partner}
              required
            >
              <input
                type="text"
                value={formData.partner}
                onChange={(e) => handleChange('partner', e.target.value)}
                className="input-morandi"
                placeholder="请输入合作方名称"
              />
            </FormField>

            <FormField label="业配类型">
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="input-morandi"
                placeholder="请输入业配类型"
              />
            </FormField>

            <FormField
              label="业配日期"
              error={errors.date}
              required
            >
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="input-morandi"
              />
            </FormField>

            <FormField label="制定渠道">
              <input
                type="text"
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className="input-morandi"
                placeholder="请输入制定渠道"
              />
            </FormField>

            <FormField
              label="合作金额"
              error={errors.amount}
              required
            >
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </FormField>

            <FormField label="转账周期">
              <select
                value={formData.transferCycle}
                onChange={(e) => handleChange('transferCycle', e.target.value)}
                className="input-morandi"
              >
                <option value="">请选择</option>
                <option value="T+7">T+7</option>
                <option value="T+15">T+15</option>
                <option value="T+30">T+30</option>
                <option value="T+45">T+45</option>
                <option value="T+60">T+60</option>
                <option value="其他">其他</option>
              </select>
            </FormField>

            <FormField label="应转账日期">
              <input
                type="date"
                value={formData.transferDate}
                onChange={(e) => handleChange('transferDate', e.target.value)}
                className="input-morandi"
              />
            </FormField>

            <FormField label="转账状态">
              <select
                value={formData.transferStatus}
                onChange={(e) => handleChange('transferStatus', e.target.value)}
                className="input-morandi"
              >
                <option value="待转账">待转账</option>
                <option value="处理中">处理中</option>
                <option value="已转账">已转账</option>
              </select>
            </FormField>

            <FormField label="已收金额">
              <input
                type="number"
                value={formData.receivedAmount}
                onChange={(e) => handleChange('receivedAmount', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </FormField>

            <FormField label="公司分成">
              <input
                type="number"
                value={formData.companyShare}
                readOnly
                className="input-morandi bg-[var(--morandi-pearl)]"
                placeholder="自动计算"
              />
            </FormField>

            <FormField label="博主分成">
              <input
                type="number"
                value={formData.creatorShare}
                readOnly
                className="input-morandi bg-[var(--morandi-pearl)]"
                placeholder="自动计算"
              />
            </FormField>

            <FormField label="业配详情" className="md:col-span-2">
              <textarea
                value={formData.informalDetails}
                onChange={(e) => handleChange('informalDetails', e.target.value)}
                className="input-morandi h-20 resize-none"
                placeholder="请输入业配的详细信息..."
              />
            </FormField>
          </div>

          <ModalFooter onCancel={onClose}>
            <button type="submit" className="btn-morandi-primary">
              <Save size={18} />
              {isNew ? '添加记录' : '保存修改'}
            </button>
          </ModalFooter>
        </form>
      </div>
    </ModalWrapper>
  );
}

// 账号模态框
export function AccountModal({ isOpen, onClose, account, onSave, creators, isNew }: {
  isOpen: boolean;
  onClose: () => void;
  account: Account | null;
  onSave: (data: Account) => void;
  creators: Creator[];
  isNew: boolean;
}) {
  const [formData, setFormData] = useState<Account>(
    account || {
      creatorId: '',
      platform: '',
      link: '',
      followers: 0,
      price: 0,
      updateDate: new Date().toISOString().split('T')[0]
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (account) {
      setFormData(account);
    }
  }, [account]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.creatorId) newErrors.creatorId = '请选择博主';
    if (!formData.platform.trim()) newErrors.platform = '请输入平台名称';
    if (formData.followers < 0) newErrors.followers = '粉丝数不能为负数';
    if (formData.price < 0) newErrors.price = '报价不能为负数';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Account, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-content-morandi max-w-2xl">
        <ModalHeader
          icon={UserCheck}
          title={isNew ? '新增平台账号' : '编辑平台账号'}
          subtitle={isNew ? '请填写平台账号信息' : '更新平台账号信息'}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <FormField
              label="选择博主"
              error={errors.creatorId}
              required
            >
              <input
                list="creators-list"
                value={formData.creatorId}
                onChange={(e) => handleChange('creatorId', e.target.value)}
                className="input-morandi"
                placeholder="输入博主ID搜索..."
                disabled={!isNew}
              />
              <datalist id="creators-list">
                {creators.map(creator => (
                  <option key={creator.id} value={creator.id}>
                    {creator.id} - {creator.realName} - {creator.wechatName}
                  </option>
                ))}
              </datalist>
              {formData.creatorId && (
                <p className="text-sm text-[var(--morandi-mist)] mt-1">
                  已选择: {creators.find(c => c.id === formData.creatorId)?.realName || formData.creatorId}
                </p>
              )}
            </FormField>

            <FormField
              label="平台名称"
              error={errors.platform}
              required
            >
              <select
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="input-morandi"
                disabled={!isNew}
              >
                <option value="">请选择平台</option>
                <option value="小红书">小红书</option>
                <option value="抖音">抖音</option>
                <option value="B站">B站</option>
                <option value="微博">微博</option>
                <option value="快手">快手</option>
                <option value="公众号">公众号</option>
                <option value="其他">其他</option>
              </select>
            </FormField>

            <FormField label="账号链接">
              <input
                type="url"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="input-morandi"
                placeholder="https://..."
              />
            </FormField>

            <FormField
              label="粉丝数"
              error={errors.followers}
            >
              <input
                type="number"
                value={formData.followers}
                onChange={(e) => handleChange('followers', parseInt(e.target.value))}
                className="input-morandi"
                placeholder="0"
                min="0"
              />
            </FormField>

            <FormField
              label="平台报价"
              error={errors.price}
            >
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                className="input-morandi"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </FormField>

            <FormField label="更新日期">
              <input
                type="date"
                value={formData.updateDate}
                onChange={(e) => handleChange('updateDate', e.target.value)}
                className="input-morandi"
              />
            </FormField>
          </div>

          <ModalFooter onCancel={onClose}>
            <button type="submit" className="btn-morandi-primary">
              <Save size={18} />
              {isNew ? '添加账号' : '保存修改'}
            </button>
          </ModalFooter>
        </form>
      </div>
    </ModalWrapper>
  );
}

// 导入模态框
export function ImportModal({ isOpen, onClose, onImportSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/import/preview', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setPreviewData(result.data.slice(0, 5));
        setValidationResults(result);
      } else {
        alert(`预览失败: ${result.message}`);
      }
    } catch (error) {
      console.error('预览失败:', error);
      alert('预览失败，请检查文件格式');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import/creators', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setImportComplete(true);
        setTimeout(() => {
          onImportSuccess();
          handleClose();
        }, 2000);
      } else {
        alert(`导入失败: ${result.message}`);
      }
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败，请重试');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setValidationResults(null);
    setImporting(false);
    setImportComplete(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={handleClose}>
      <div className="modal-content-morandi max-w-4xl">
        <ModalHeader
          icon={Upload}
          title="导入博主数据"
          subtitle="支持 Excel (.xlsx, .xls) 和 CSV 格式"
          onClose={handleClose}
        />

        <div className="p-8">
          {!file && (
            <div 
              className="border-2 border-dashed border-[var(--morandi-pearl)] rounded-2xl p-16 text-center cursor-pointer hover:border-[var(--morandi-cloud)] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="text-[var(--morandi-mist)] mx-auto mb-4" />
              <p className="text-[var(--morandi-stone)] font-medium mb-2">点击或拖拽文件到此处</p>
              <p className="text-sm text-[var(--morandi-mist)]">支持 .xlsx, .xls, .csv 格式</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {file && !importComplete && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-[var(--morandi-pearl)]/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="text-[var(--morandi-cloud)]" />
                  <div>
                    <p className="font-medium text-[var(--morandi-stone)]">{file.name}</p>
                    <p className="text-sm text-[var(--morandi-mist)]">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setValidationResults(null);
                  }}
                  className="text-[var(--morandi-mist)] hover:text-[var(--morandi-stone)]"
                >
                  <X size={20} />
                </button>
              </div>

              {validationResults && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-[var(--morandi-stone)]">数据预览</h4>
                    <span className="text-sm text-[var(--morandi-mist)]">
                      有效数据: {validationResults.validation.valid} 行 / 
                      无效数据: {validationResults.validation.invalid} 行
                    </span>
                  </div>

                  {previewData.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--morandi-pearl)]">
                            <th className="text-left p-2">博主ID</th>
                            <th className="text-left p-2">真实姓名</th>
                            <th className="text-left p-2">微信名</th>
                            <th className="text-left p-2">城市</th>
                            <th className="text-left p-2">类别</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index} className="border-b border-[var(--morandi-pearl)]/50">
                              <td className="p-2">{row.id}</td>
                              <td className="p-2">{row.realName}</td>
                              <td className="p-2">{row.wechatName}</td>
                              <td className="p-2">{row.city}</td>
                              <td className="p-2">{row.category}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {validationResults.validation.errors.length > 0 && (
                    <div className="p-4 bg-[var(--morandi-rose)]/10 rounded-xl">
                      <p className="font-medium text-[var(--morandi-rose)] mb-2">验证错误:</p>
                      <ul className="text-sm text-[var(--morandi-stone)] space-y-1">
                        {validationResults.validation.errors.slice(0, 5).map((error: string, index: number) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {validationResults.validation.errors.length > 5 && (
                          <li>• ... 还有 {validationResults.validation.errors.length - 5} 个错误</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button onClick={handleClose} className="btn-morandi-secondary">
                  取消
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing || !validationResults || validationResults.validation.valid === 0}
                  className="btn-morandi-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {importing ? (
                    <>
                      <Loader2 size={18} className="animate-morandi-spin" />
                      导入中...
                    </>
                  ) : (
                    <>
                      <Database size={18} />
                      确认导入
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {importComplete && (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-[var(--morandi-sage)] mx-auto mb-6" />
              <h3 className="text-xl font-medium text-[var(--morandi-stone)] mb-3">导入完成</h3>
              <p className="text-[var(--morandi-mist)] mb-8">博主数据已成功导入系统</p>
              <button onClick={handleClose} className="btn-morandi-primary">
                完成
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

// 导出模态框
export function ExportModal({ isOpen, onClose, creators, accounts, deals }: {
  isOpen: boolean;
  onClose: () => void;
  creators: Creator[];
  accounts: Account[];
  deals: Deal[];
}) {
  const [exportType, setExportType] = useState('creators');
  const [format, setFormat] = useState('excel');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      let data: any[] = [];
      let filename = '';

      switch (exportType) {
        case 'creators':
          data = creators;
          filename = `博主数据_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'accounts':
          data = accounts;
          filename = `账号数据_${new Date().toISOString().split('T')[0]}`;
          break;
        case 'deals':
          data = deals;
          filename = `业配数据_${new Date().toISOString().split('T')[0]}`;
          break;
        default:
          throw new Error('无效的导出类型');
      }

      if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        fileDownload(blob, `${filename}.json`);
      } else {
        // Excel/CSV 导出需要调用API
        const response = await fetch('/api/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: exportType, format, data }),
        });

        if (response.ok) {
          const blob = await response.blob();
          fileDownload(blob, `${filename}.${format === 'excel' ? 'xlsx' : 'csv'}`);
        } else {
          throw new Error('导出失败');
        }
      }

      onClose();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="modal-content-morandi max-w-2xl">
        <ModalHeader
          icon={Download}
          title="导出数据"
          subtitle="选择要导出的数据类型和格式"
          onClose={onClose}
        />

        <div className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-4">
              选择数据类型
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'creators', label: '博主数据', count: creators.length },
                { value: 'accounts', label: '账号数据', count: accounts.length },
                { value: 'deals', label: '业配数据', count: deals.length },
              ].map(option => (
                <label key={option.value} className="relative">
                  <input
                    type="radio"
                    name="exportType"
                    value={option.value}
                    checked={exportType === option.value}
                    onChange={(e) => setExportType(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    exportType === option.value
                      ? 'border-[var(--morandi-cloud)] bg-[var(--morandi-cloud)]/10'
                      : 'border-[var(--morandi-pearl)] hover:border-[var(--morandi-mist)]'
                  }`}>
                    <div className="text-[var(--morandi-stone)] font-medium">{option.label}</div>
                    <div className="text-sm text-[var(--morandi-mist)] mt-1">{option.count} 条记录</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-4">
              选择导出格式
            </label>
            <div className="space-y-3">
              {[
                { value: 'excel', label: 'Excel (.xlsx)', description: '适合在 Excel 中查看和编辑' },
                { value: 'csv', label: 'CSV (.csv)', description: '通用格式，兼容性好' },
                { value: 'json', label: 'JSON (.json)', description: '适合程序处理' },
              ].map(option => (
                <label key={option.value} className="flex items-center p-3 border border-[var(--morandi-pearl)] rounded-xl hover:bg-[var(--morandi-pearl)]/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value={option.value}
                    checked={format === option.value}
                    onChange={(e) => setFormat(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-[var(--morandi-stone)]">{option.label}</div>
                    <div className="text-xs text-[var(--morandi-mist)]">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <ModalFooter onCancel={onClose}>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-morandi-primary disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <Loader2 size={18} className="animate-morandi-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  开始导出
                </>
              )}
            </button>
          </ModalFooter>
        </div>
      </div>
    </ModalWrapper>
  );
}

// 辅助组件
function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="modal-morandi" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

function ModalHeader({ icon: Icon, title, subtitle, onClose }: {
  icon: any;
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-8 border-b border-[var(--morandi-pearl)]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[var(--morandi-cloud)]/10 rounded-2xl">
          <Icon className="h-6 w-6 text-[var(--morandi-cloud)]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--morandi-stone)]">{title}</h2>
          <p className="text-sm text-[var(--morandi-mist)] mt-1">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-[var(--morandi-pearl)] rounded-xl transition-colors"
      >
        <X size={20} className="text-[var(--morandi-mist)]" />
      </button>
    </div>
  );
}

function ModalFooter({ children, onCancel }: { children: React.ReactNode; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-[var(--morandi-pearl)]">
      <button type="button" onClick={onCancel} className="btn-morandi-secondary">
        取消
      </button>
      {children}
    </div>
  );
}

function FormField({ label, error, required, children, className = '' }: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[var(--morandi-stone)] mb-2">
        {label}
        {required && <span className="text-[var(--morandi-rose)] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-[var(--morandi-rose)] mt-1">{error}</p>}
    </div>
  );
}