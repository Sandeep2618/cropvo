'use client';

import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch } from 'antd';
import type { StoreItem, StoreItemFormValues } from '@/lib/types/store';
import { DEFAULT_CATEGORIES, MEDICINE_UNITS } from '@/lib/types/store';

interface Props {
  open: boolean;
  editing: StoreItem | null;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (values: StoreItemFormValues) => void;
}

export default function MedicineFormModal({
  open,
  editing,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<StoreItemFormValues>();

  useEffect(() => {
    if (!open) return;

    if (editing) {
      form.setFieldsValue({
        name: editing.name,
        sku: editing.sku,
        description: editing.description,
        category: editing.category,
        price: editing.price,
        stockQuantity: editing.stockQuantity,
        unit: editing.unit,
        manufacturer: editing.manufacturer,
        dosageInfo: editing.dosageInfo,
        requiresPrescription: editing.requiresPrescription,
        imageUrl: editing.imageUrl,
        expiryDate: editing.expiryDate
          ? editing.expiryDate.slice(0, 10)
          : undefined,
        isActive: editing.isActive,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        unit: 'strip',
        requiresPrescription: false,
        isActive: true,
        stockQuantity: 0,
      });
    }
  }, [open, editing, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      title={editing ? 'Edit medicine' : 'Add medicine to store'}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText={editing ? 'Save changes' : 'Add medicine'}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false} className="pt-2">
        <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-4">
          <Form.Item name="name" label="Medicine name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Paracetamol 500mg" size="large" />
          </Form.Item>
          <Form.Item name="sku" label="SKU (optional)">
            <Input placeholder="MED-001" size="large" />
          </Form.Item>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-4">
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Category is required' }]}>
            <Select
              size="large"
              showSearch
              placeholder="Select category"
              options={DEFAULT_CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </Form.Item>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Select size="large" options={MEDICINE_UNITS} />
          </Form.Item>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-4">
          <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: 'Price is required' }]}>
            <InputNumber min={0} step={0.01} className="!w-full" size="large" />
          </Form.Item>
          <Form.Item name="stockQuantity" label="Stock quantity" rules={[{ required: true }]}>
            <InputNumber min={0} className="!w-full" size="large" />
          </Form.Item>
        </div>

        <Form.Item name="manufacturer" label="Manufacturer">
          <Input placeholder="Company name" size="large" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Uses, composition, storage..." />
        </Form.Item>

        <Form.Item name="dosageInfo" label="Dosage information">
          <Input placeholder="e.g. 1 tablet twice daily" size="large" />
        </Form.Item>

        <Form.Item name="imageUrl" label="Image URL (optional)">
          <Input placeholder="https://..." size="large" />
        </Form.Item>

        <Form.Item name="expiryDate" label="Expiry date (optional)">
          <Input type="date" size="large" />
        </Form.Item>

        <div className="flex flex-wrap gap-6">
          <Form.Item name="requiresPrescription" label="Prescription required" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isActive" label="Available in store" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
