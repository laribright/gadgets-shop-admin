'use server';

import slugify from 'slugify';

import { CategoriesWithProductsResponse } from '@/app/admin/categories/categories.types';
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
} from '@/app/admin/categories/create-category.schema';
import { createClient } from '@/supabase/server';
import { revalidatePath } from 'next/cache';

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('category')
      .select('* , products:product(*)')
      .returns<CategoriesWithProductsResponse>();

    if (error) throw new Error(`Error fetching categories: ${error.message}`);

    return data || [];
  };

export const imageUploadHandler = async (formData: FormData) => {
  const supabase = createClient();
  if (!formData) return;

  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof File)) throw new Error('Expected a file');

  const fileName = fileEntry.name;

  try {
    const { data, error } = await supabase.storage
      .from('app-images')
      .upload(fileName, fileEntry, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }

    const {
      data: { publicUrl },
    } = await supabase.storage.from('app-images').getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
};

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const supabase = createClient();
  const slug = slugify(name, { lower: true });

  const { data, error } = await supabase.from('category').insert({
    name,
    imageUrl,
    slug,
  });

  if (error) throw new Error(`Error creating category: ${error.message}`);

  revalidatePath('/admin/categories');

  return data;
};

export const updateCategory = async ({
  imageUrl,
  name,
  slug,
}: UpdateCategorySchema) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('category')
    .update({ name, imageUrl })
    .match({ slug });

  if (error) throw new Error(`Error updating category: ${error.message}`);

  revalidatePath('/admin/categories');

  return data;
};

export const deleteCategory = async (id: number) => {
  const supabase = createClient();
  const { error } = await supabase.from('category').delete().match({ id });

  if (error) throw new Error(`Error deleting category: ${error.message}`);

  revalidatePath('/admin/categories');
};

export const getCategoryData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('category')
    .select('name, products:product(id)');

  if (error) throw new Error(`Error fetching category data: ${error.message}`);

  const categoryData = data.map(
    (category: { name: string; products: { id: number }[] }) => ({
      name: category.name,
      products: category.products.length,
    })
  );

  return categoryData;
};
