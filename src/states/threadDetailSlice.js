import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const asyncGetThreadDetail = createAsyncThunk(
  'threadDetail/asyncGetThreadDetail',
  async (id, { rejectWithValue }) => {
    try {
      const { detailThread } = await api.getThreadDetail(id);
      return detailThread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncCreateComment = createAsyncThunk(
  'threadDetail/asyncCreateComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      await api.createComment({ threadId, content });
      const { detailThread } = await api.getThreadDetail(threadId);
      return detailThread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncUpVoteThread = createAsyncThunk(
  'threadDetail/asyncUpVoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      await api.upVoteThread(threadId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncDownVoteThread = createAsyncThunk(
  'threadDetail/asyncDownVoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      await api.downVoteThread(threadId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncNeutralVoteThread = createAsyncThunk(
  'threadDetail/asyncNeutralVoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      await api.neutralizeVoteThread(threadId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncUpVoteComment = createAsyncThunk(
  'threadDetail/asyncUpVoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      await api.upVoteComment({ threadId, commentId });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncDownVoteComment = createAsyncThunk(
  'threadDetail/asyncDownVoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      await api.downVoteComment({ threadId, commentId });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const asyncNeutralVoteComment = createAsyncThunk(
  'threadDetail/asyncNeutralVoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      await api.neutralizeVoteComment({ threadId, commentId });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

function normalizeDetail(detail) {
  return {
    ...detail,
    user: detail.owner || null,
    comments: (detail.comments || []).map((c) => ({
      ...c,
      user: c.owner || null,
    })),
  };
}

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearThreadDetail(state) {
      state.thread = null;
      state.comments = [];
    },
    optimisticVoteThread(state, action) {
      const { userId, voteType } = action.payload;
      if (!state.thread) return;

      state._prevThreadUpVotesBy = [...state.thread.upVotesBy];
      state._prevThreadDownVotesBy = [...state.thread.downVotesBy];

      if (voteType === 'upvote') {
        state.thread.upVotesBy = state.thread.upVotesBy.includes(userId)
          ? state.thread.upVotesBy
          : [...state.thread.upVotesBy, userId];
        state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
      } else if (voteType === 'downvote') {
        state.thread.downVotesBy = state.thread.downVotesBy.includes(userId)
          ? state.thread.downVotesBy
          : [...state.thread.downVotesBy, userId];
        state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
      } else if (voteType === 'neutral') {
        state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
        state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
      }
    },
    optimisticVoteComment(state, action) {
      const { commentId, userId, voteType } = action.payload;
      const comment = state.comments.find((c) => c.id === commentId);
      if (!comment) return;

      comment._prevUpVotesBy = [...comment.upVotesBy];
      comment._prevDownVotesBy = [...comment.downVotesBy];

      if (voteType === 'upvote') {
        comment.upVotesBy = comment.upVotesBy.includes(userId)
          ? comment.upVotesBy
          : [...comment.upVotesBy, userId];
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      } else if (voteType === 'downvote') {
        comment.downVotesBy = comment.downVotesBy.includes(userId)
          ? comment.downVotesBy
          : [...comment.downVotesBy, userId];
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      } else if (voteType === 'neutral') {
        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asyncGetThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        const detail = normalizeDetail(action.payload);
        state.thread = detail;
        state.comments = detail.comments;
      })
      .addCase(asyncGetThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(asyncCreateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncCreateComment.fulfilled, (state, action) => {
        state.loading = false;
        const detail = normalizeDetail(action.payload);
        state.thread = detail;
        state.comments = detail.comments;
      })
      .addCase(asyncCreateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(asyncUpVoteThread.rejected, (state) => {
        if (state.thread && state._prevThreadUpVotesBy) {
          state.thread.upVotesBy = state._prevThreadUpVotesBy;
          state.thread.downVotesBy = state._prevThreadDownVotesBy;
          delete state._prevThreadUpVotesBy;
          delete state._prevThreadDownVotesBy;
        }
      })
      .addCase(asyncDownVoteThread.rejected, (state) => {
        if (state.thread && state._prevThreadUpVotesBy) {
          state.thread.upVotesBy = state._prevThreadUpVotesBy;
          state.thread.downVotesBy = state._prevThreadDownVotesBy;
          delete state._prevThreadUpVotesBy;
          delete state._prevThreadDownVotesBy;
        }
      })
      .addCase(asyncNeutralVoteThread.rejected, (state) => {
        if (state.thread && state._prevThreadUpVotesBy) {
          state.thread.upVotesBy = state._prevThreadUpVotesBy;
          state.thread.downVotesBy = state._prevThreadDownVotesBy;
          delete state._prevThreadUpVotesBy;
          delete state._prevThreadDownVotesBy;
        }
      })
      .addCase(asyncUpVoteComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment && comment._prevUpVotesBy) {
          comment.upVotesBy = comment._prevUpVotesBy;
          comment.downVotesBy = comment._prevDownVotesBy;
          delete comment._prevUpVotesBy;
          delete comment._prevDownVotesBy;
        }
      })
      .addCase(asyncDownVoteComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment && comment._prevUpVotesBy) {
          comment.upVotesBy = comment._prevUpVotesBy;
          comment.downVotesBy = comment._prevDownVotesBy;
          delete comment._prevUpVotesBy;
          delete comment._prevDownVotesBy;
        }
      })
      .addCase(asyncNeutralVoteComment.rejected, (state, action) => {
        const { commentId } = action.meta.arg;
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment && comment._prevUpVotesBy) {
          comment.upVotesBy = comment._prevUpVotesBy;
          comment.downVotesBy = comment._prevDownVotesBy;
          delete comment._prevUpVotesBy;
          delete comment._prevDownVotesBy;
        }
      });
  },
});

export {
  asyncGetThreadDetail,
  asyncCreateComment,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralVoteThread,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralVoteComment,
};
export const { clearThreadDetail, optimisticVoteThread, optimisticVoteComment } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
