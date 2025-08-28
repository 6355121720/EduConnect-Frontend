// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiClient from '../../../src/api/apiClient'; // adjust path if needed
// import notificationsApi from '../../../src/api/notificationsApi';

// // fetch latest notifications (paged)
// export const fetchNotifications = createAsyncThunk(
//   'notifications/fetch',
//   async ({ page = 0, size = 50 } = {}, { rejectWithValue }) => {
//     try {
//       const res = await apiClient.get('/notifications', { params: { page, size } });
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// // new: fetch unread count
// export const fetchUnreadCount = createAsyncThunk(
//   'notifications/unreadCount',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await notificationsApi.unreadCount();
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// const initialState = {
//   byId: {},
//   order: [], // newest first
//   unreadCount: 0,
//   status: 'idle',
//   lastSeenAtISO: null,
// };

// const notificationsSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     addOrMerge(state, action) {
//       const items = Array.isArray(action.payload) ? action.payload : [action.payload];
//       items.forEach((n) => {
//         state.byId[n.id] = { ...(state.byId[n.id] || {}), ...n };
//         // ensure newest-first order
//         state.order = [n.id, ...state.order.filter((id) => id !== n.id)];
//       });
//       state.unreadCount = Object.values(state.byId).filter((x) => !x.read).length;
//     },
//     markRead(state, action) {
//       const id = action.payload;
//       if (state.byId[id] && !state.byId[id].read) {
//         state.byId[id].read = true;
//         state.unreadCount = Math.max(0, state.unreadCount - 1);
//       }
//     },
//     markAllRead(state) {
//       Object.values(state.byId).forEach((n) => (n.read = true));
//       state.unreadCount = 0;
//     },
//     removeNotification(state, action) {
//       const id = action.payload;
//       delete state.byId[id];
//       state.order = state.order.filter((x) => x !== id);
//     },
//     setLastSeen(state, action) {
//       state.lastSeenAtISO = action.payload;
//     },
//     clear(state) {
//       state.byId = {};
//       state.order = [];
//       state.unreadCount = 0;
//       state.status = 'idle';
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchNotifications.pending, (s) => { s.status = 'loading'; })
//       .addCase(fetchNotifications.fulfilled, (s, { payload }) => {
//         s.status = 'idle';
//         // assume payload.items array newest first
//         payload.items.forEach((n) => {
//           s.byId[n.id] = n;
//           if (!s.order.includes(n.id)) s.order.push(n.id);
//         });
//         // keep newest-first (reverse if backend returned newest-first but we push)
//         s.order = Array.from(new Set(s.order)).reverse();
//         s.unreadCount = Object.values(s.byId).filter((x) => !x.read).length;
//       })
//       .addCase(fetchNotifications.rejected, (s) => { s.status = 'error'; })

//       // unread count handlers
//       .addCase(fetchUnreadCount.fulfilled, (s, { payload }) => {
//         // backend returns number
//         s.unreadCount = typeof payload === 'number' ? payload : payload?.count ?? s.unreadCount;
//       })
//       .addCase(fetchUnreadCount.rejected, (s) => { /* ignore */ });
//   },
// });

// export const {
//   addOrMerge, markRead, markAllRead, removeNotification, setLastSeen, clear,
// } = notificationsSlice.actions;

// export default notificationsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../src/api/apiClient';
import notificationsApi from '../../../src/api/notificationsApi';

// fetch latest notifications (paged)
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async ({ page = 0, size = 50 } = {}, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/notifications', { params: { page, size } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationsApi.unreadCount();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  byId: {},
  order: [], // newest first
  unreadCount: 0,
  status: 'idle',
  lastSeenAtISO: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addOrMerge(state, action) {
      const items = Array.isArray(action.payload) ? action.payload : [action.payload];
      items.forEach((n) => {
        state.byId[n.id] = { ...(state.byId[n.id] || {}), ...n };
        // ensure newest-first order
        state.order = [n.id, ...state.order.filter((id) => id !== n.id)];
      });
      state.unreadCount = Object.values(state.byId).filter((x) => !x.read).length;
    },
    markRead(state, action) {
      const id = action.payload;
      if (state.byId[id] && !state.byId[id].read) {
        state.byId[id].read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      Object.values(state.byId).forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    removeNotification(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.order = state.order.filter((x) => x !== id);
    },
    setLastSeen(state, action) {
      state.lastSeenAtISO = action.payload;
    },
    clear(state) {
      state.byId = {};
      state.order = [];
      state.unreadCount = 0;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchNotifications.fulfilled, (s, { payload }) => {
        s.status = 'idle';
        
        // Handle the Page object structure from Spring Data
        // The content is in payload.content, not payload.items
        const notifications = payload.content || [];
        
        notifications.forEach((n) => {
          s.byId[n.id] = n;
          if (!s.order.includes(n.id)) s.order.push(n.id);
        });
        
        // Keep newest-first order
        s.order = Array.from(new Set(s.order)).reverse();
        s.unreadCount = Object.values(s.byId).filter((x) => !x.read).length;
      })
      .addCase(fetchNotifications.rejected, (s) => { s.status = 'error'; })

      // unread count handlers
      .addCase(fetchUnreadCount.fulfilled, (s, { payload }) => {
        // backend returns number directly or in a response object
        s.unreadCount = typeof payload === 'number' ? payload : payload?.count ?? s.unreadCount;
      })
      .addCase(fetchUnreadCount.rejected, (s) => { /* ignore */ });
  },
});

export const {
  addOrMerge, markRead, markAllRead, removeNotification, setLastSeen, clear,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;