import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import type {Book, BookBorrow} from '@/types';
import api from '@/services/api';

export const useLibraryStore = defineStore('library', () => {
  const books = ref<Book[]>([]);
  const borrows = ref<BookBorrow[]>([]);
  const loading = ref(false);
  const error = ref('');

  const getAvailableBooks = computed(() => books.value.filter(b => b.availableQuantity > 0));
  const getOverdueBooks = computed(() => {
    const today = new Date();
    return borrows.value.filter(b => b.status === 'active' && new Date(b.dueDate) < today);
  });
  const getUserBorrowHistory = computed(() => (userId: string) =>
    borrows.value.filter(b => b.userId === userId)
  );

  async function fetchBooks(schoolId: string, filters?: { category?: string; search?: string }) {
    loading.value = true;
    error.value = '';
    try {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      const query = params.toString() ? `?${params}` : '';
      const data = await api.get(`/schools/${schoolId}/books${query}`);
      books.value = data.books;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function fetchBorrows(schoolId: string, status?: string) {
    loading.value = true;
    try {
      const query = status ? `?status=${status}` : '';
      const data = await api.get(`/schools/${schoolId}/book-borrows${query}`);
      borrows.value = data.borrows;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function addBook(schoolId: string, book: Omit<Book, 'id' | 'addedDate'>) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/books`, book);
      books.value.push(data.book);
      return data.book;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function borrowBook(schoolId: string, bookId: string, userId: string, dueDate: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.post(`/schools/${schoolId}/book-borrows`, {
        bookId,
        userId,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate,
        status: 'active'
      });
      borrows.value.push(data.borrow);

      // Decrease available quantity
      const bookIndex = books.value.findIndex(b => b.id === bookId);
      if (bookIndex !== -1) {
        books.value[bookIndex].availableQuantity--;
      }

      return data.borrow;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function returnBook(schoolId: string, borrowId: string) {
    loading.value = true;
    error.value = '';
    try {
      const data = await api.put(`/schools/${schoolId}/book-borrows/${borrowId}/return`, {
        returnDate: new Date().toISOString().split('T')[0],
        status: 'returned'
      });
      const index = borrows.value.findIndex(b => b.id === borrowId);
      if (index !== -1) {
        const borrow = borrows.value[index];
        borrows.value[index] = data.borrow;

        // Increase available quantity
        const bookIndex = books.value.findIndex(b => b.id === borrow.bookId);
        if (bookIndex !== -1) {
          books.value[bookIndex].availableQuantity++;
        }
      }
      return data.borrow;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    books,
    borrows,
    loading,
    error,
    getAvailableBooks,
    getOverdueBooks,
    getUserBorrowHistory,
    fetchBooks,
    fetchBorrows,
    addBook,
    borrowBook,
    returnBook
  };
});
