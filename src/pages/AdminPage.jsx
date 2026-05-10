import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { Plus, Trash2, Save, X, Upload, Check, Loader2, Megaphone } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function AdminPage() {
  const { user } = useAuth();
  const { refreshSettings } = useSettings();
  const navigate = useNavigate();
  const { show, confirm } = useNotification();
  const [activeTab, setActiveTab] = useState('uploads');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [settingsData, setSettingsData] = useState({ about_text: '', instagram: '', twitter: '', youtube: '', github: '', discord_id: '', bg_music_url: '', discord: '', announcement_text: '', announcement_active: false, discord_bio: '', hero_title: '', hero_description: '', hero_eyebrow: '', seo_logo_url: '', favicon_url: '', site_name: '' });
  const [uploadingField, setUploadingField] = useState(null);

  // Auto-fetch YouTube title
  useEffect(() => {
    const fetchYoutubeTitle = async () => {
      const url = formData.youtube_url;
      if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) return;
      
      try {
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (response.ok) {
          const data = await response.json();
          if (data.title && (!formData.title || formData.title === '')) {
            setFormData(prev => ({ ...prev, title: data.title }));
            show('Fetched YouTube title!', 'success');
          }
        }
      } catch (err) {
        console.error('Error fetching YouTube title:', err);
      }
    };

    const timer = setTimeout(fetchYoutubeTitle, 1000);
    return () => clearTimeout(timer);
  }, [formData.youtube_url]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchItems = async () => {
    setLoading(true);
    if (activeTab === 'settings') {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (error && error.code !== 'PGRST116') {
        show('Error fetching settings: ' + error.message, 'error');
      }
      if (data) setSettingsData(data);
    } else {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        show('Error fetching ' + activeTab + ': ' + error.message, 'error');
      } else {
        setItems(data || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchItems();
    }
  }, [activeTab, user]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingField(fieldName);
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result;
        if (activeTab === 'settings') {
          setSettingsData(prev => ({ ...prev, [fieldName]: base64Url }));
        } else {
          setFormData(prev => ({ ...prev, [fieldName]: base64Url }));
        }
        show('Image converted to URL successfully!', 'success');
        setUploadingField(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      show('Conversion failed: ' + err.message, 'error');
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    if (activeTab === 'settings') {
      const payload = { id: 1, ...settingsData };
      let { error } = await supabase.from('settings').upsert([payload]);
      
      if (error && (error.message.includes('column') || error.message.includes('announcement'))) {
        const { announcement_text, announcement_active, discord_bio, ...safePayload } = payload;
        const result = await supabase.from('settings').upsert([safePayload]);
        error = result.error;
        if (!error) {
          show('Settings saved!', 'success');
          await refreshSettings();
          fetchItems();
          return;
        }
      }
      
      if (error) show('Error saving settings: ' + error.message, 'error');
      else {
        show('Settings saved successfully!', 'success');
        await refreshSettings();
        fetchItems();
      }
      return;
    }

    const payload = { ...formData };
    
    if (activeTab === 'uploads') {
      delete payload.download_url;
      delete payload.rating;
      if (!payload.youtube_url) delete payload.youtube_url;
    } else if (activeTab === 'packages') {
      delete payload.youtube_url;
      if (!payload.download_url) delete payload.download_url;
    }

    if (!payload.slug) delete payload.slug;

    if (payload.id) {
      const { error } = await supabase.from(activeTab).update(payload).eq('id', payload.id);
      if (error) show('Error updating: ' + error.message, 'error');
      else show('Updated successfully!', 'success');
    } else {
      const { id, ...newData } = payload;
      const { error } = await supabase.from(activeTab).insert([newData]);
      if (error) show('Error adding: ' + error.message, 'error');
      else show('Added successfully!', 'success');
    }
    setEditingId(null);
    setFormData({});
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this?')) {
      const { error } = await supabase.from(activeTab).delete().eq('id', id);
      if (error) show('Error deleting: ' + error.message, 'error');
      else show('Deleted successfully!', 'success');
      fetchItems();
    }
  };

  const handleAddNew = () => {
    setEditingId('new');
    setFormData({ title: '', description: '', category: '', thumbnail: '', slug: '', youtube_url: '', download_url: '' });
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <main className="page" style={{ padding: '120px 16px 60px', maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page__title" style={{ marginBottom: '30px', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>Admin <span className="text-accent">Dashboard</span></h1>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className={`btn ${activeTab === 'uploads' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('uploads')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Uploads</button>
          <button className={`btn ${activeTab === 'packages' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('packages')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Packages</button>
          <button className={`btn ${activeTab === 'settings' ? 'btn--primary' : 'btn--outline'}`} onClick={() => setActiveTab('settings')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Settings</button>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: 'clamp(14px, 4vw, 24px)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: "'Outfit', sans-serif" }}>
              {activeTab === 'uploads' ? 'Uploads' : activeTab === 'packages' ? 'Packages' : 'Global Settings'}
            </h2>
            {activeTab !== 'settings' && (
              <button className="btn btn--primary" onClick={handleAddNew}>
                <Plus size={16} /> Add New
              </button>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : activeTab === 'settings' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* ── Hero Content ── */}
              <div className="settings-group" style={{ padding: '20px', background: 'rgba(244,114,182,0.03)', borderRadius: '16px', border: '1px solid rgba(244,114,182,0.12)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--accent)', fontSize: '1rem', fontWeight: '700' }}>🎯 Hero Section Content</label>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Site / Brand Name (shown in navbar)</label>
                <input className="admin-input" type="text" value={settingsData.site_name || ''} onChange={(e) => setSettingsData({...settingsData, site_name: e.target.value})} placeholder="HIXX PLAYZ" style={{ marginBottom: '16px' }} />
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Hero Title (e.g. HIXX PLAYZ)</label>
                <input className="admin-input" type="text" value={settingsData.hero_title || ''} onChange={(e) => setSettingsData({...settingsData, hero_title: e.target.value})} placeholder="HIXX PLAYZ" />
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Hero Description</label>
                <textarea className="admin-input" value={settingsData.hero_description || ''} onChange={(e) => setSettingsData({...settingsData, hero_description: e.target.value})} placeholder="Making digital memories that last forever..." style={{ minHeight: '80px' }} />
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Hero Eyebrow Text</label>
                <input className="admin-input" type="text" value={settingsData.hero_eyebrow || ''} onChange={(e) => setSettingsData({...settingsData, hero_eyebrow: e.target.value})} placeholder="Genius · Playboy · Philanthropist · Leader" />
              </div>

              {/* ── SEO Logo ── */}
              <div className="settings-group" style={{ padding: '20px', background: 'rgba(34,197,94,0.03)', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.12)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#4ade80', fontSize: '1rem', fontWeight: '700' }}>🔍 SEO Logo / OG Image</label>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>This image will be used as the website favicon, Open Graph preview image, and Twitter card image.</p>
                <div className="file-upload-container">
                  <label className={`file-upload-label ${uploadingField === 'seo_logo_url' ? 'file-upload-label--active' : ''}`}>
                    {uploadingField === 'seo_logo_url' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                    <span>{uploadingField === 'seo_logo_url' ? 'Uploading...' : 'Upload SEO Logo'}</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'seo_logo_url')} />
                  </label>
                  <input className="admin-input" type="text" value={settingsData.seo_logo_url || ''} onChange={(e) => setSettingsData({...settingsData, seo_logo_url: e.target.value})} placeholder="Or paste image URL" />
                  {settingsData.seo_logo_url && <img src={settingsData.seo_logo_url} alt="SEO Logo Preview" style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-glass)' }} />}
                </div>
              </div>

              {/* ── Website Favicon ── */}
              <div className="settings-group" style={{ padding: '20px', background: 'rgba(236,72,153,0.03)', borderRadius: '16px', border: '1px solid rgba(236,72,153,0.12)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#f472b6', fontSize: '1rem', fontWeight: '700' }}>🎨 Website Favicon (.ico, .png, .svg)</label>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>This icon is displayed in browser tabs and bookmarks. Supports ico, png, svg, etc.</p>
                <div className="file-upload-container">
                  <label className={`file-upload-label ${uploadingField === 'favicon_url' ? 'file-upload-label--active' : ''}`}>
                    {uploadingField === 'favicon_url' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                    <span>{uploadingField === 'favicon_url' ? 'Uploading...' : 'Upload Favicon'}</span>
                    <input type="file" accept=".ico,.png,.svg,image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'favicon_url')} />
                  </label>
                  <input className="admin-input" type="text" value={settingsData.favicon_url || ''} onChange={(e) => setSettingsData({...settingsData, favicon_url: e.target.value})} placeholder="Or paste icon URL" />
                  {settingsData.favicon_url && <img src={settingsData.favicon_url} alt="Favicon Preview" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border-glass)' }} />}
                </div>
              </div>

              <div className="settings-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>About Section Text</label>
                <textarea className="admin-input" value={settingsData.about_text || ''} onChange={(e) => setSettingsData({...settingsData, about_text: e.target.value})} placeholder="About me..." />
              </div>

              {['instagram', 'twitter', 'youtube', 'github', 'discord'].map(platform => {
                let platformLinks = [];
                try {
                  platformLinks = typeof settingsData[platform] === 'string' ? (settingsData[platform].startsWith('[') ? JSON.parse(settingsData[platform]) : [{ title: 'Main', url: settingsData[platform] }]) : (settingsData[platform] || []);
                } catch(e) { platformLinks = []; }

                return (
                  <div key={platform} className="settings-group" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                    <label style={{ display: 'block', marginBottom: '12px', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'capitalize' }}>{platform} Links</label>
                    <div className="admin-social-list">
                      {platformLinks.map((link, idx) => (
                        <div key={idx} className="admin-social-item">
                          <input className="admin-input" style={{ flex: 1 }} placeholder="Title" value={link.title} onChange={(e) => {
                              const newLinks = [...platformLinks];
                              newLinks[idx].title = e.target.value;
                              setSettingsData({...settingsData, [platform]: JSON.stringify(newLinks)});
                            }}
                          />
                          <input 
                            className="admin-input" 
                            style={{ flex: 2 }} 
                            placeholder="URL" 
                            value={link.url} 
                            onChange={(e) => {
                              const newLinks = [...platformLinks];
                              newLinks[idx].url = e.target.value;
                              setSettingsData({...settingsData, [platform]: JSON.stringify(newLinks)});
                            }}
                          />
                          <button 
                            className="btn btn--outline" 
                            style={{ padding: '8px', color: '#ef4444' }} 
                            onClick={() => {
                              const newLinks = platformLinks.filter((_, i) => i !== idx);
                              setSettingsData({...settingsData, [platform]: JSON.stringify(newLinks)});
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="btn btn--outline btn--full" 
                      style={{ fontSize: '0.8rem', marginTop: '8px' }}
                      onClick={() => {
                        const newLinks = [...platformLinks, { title: '', url: '' }];
                        setSettingsData({...settingsData, [platform]: JSON.stringify(newLinks)});
                      }}
                    >
                      <Plus size={14} /> Add {platform} Link
                    </button>
                  </div>
                );
              })}

              <div className="settings-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Background Music</label>
                <div className="file-upload-container">
                  <label className={`file-upload-label ${uploadingField === 'bg_music_url' ? 'file-upload-label--active' : ''}`}>
                    {uploadingField === 'bg_music_url' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                    <span>{uploadingField === 'bg_music_url' ? 'Uploading...' : 'Upload New Song'}</span>
                    <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'bg_music_url')} />
                  </label>
                  <input className="admin-input" type="text" value={settingsData.bg_music_url || ''} onChange={(e) => setSettingsData({...settingsData, bg_music_url: e.target.value})} placeholder="Or paste audio URL" />
                </div>
              </div>

              <div className="settings-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Discord User ID</label>
                <input className="admin-input" type="text" value={settingsData.discord_id || ''} onChange={(e) => setSettingsData({...settingsData, discord_id: e.target.value})} placeholder="Your Discord Snowflake ID" />
              </div>

              <div className="settings-group">
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Custom Discord Bio</label>
                <textarea className="admin-input" value={settingsData.discord_bio || ''} onChange={(e) => setSettingsData({...settingsData, discord_bio: e.target.value})} placeholder="Crafting digital experiences..." style={{ minHeight: '80px' }} />
              </div>

              <div className="settings-group" style={{ padding: '20px', background: 'rgba(167,139,250,0.03)', borderRadius: '16px', border: '1px solid rgba(167,139,250,0.15)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--accent)', fontSize: '1rem', fontWeight: '700' }}>
                  <Megaphone size={20} /> Announcement
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <input 
                      type="checkbox" 
                      checked={settingsData.announcement_active || false} 
                      onChange={(e) => setSettingsData({...settingsData, announcement_active: e.target.checked})}
                      style={{ width: '18px', height: '18px', accentColor: '#a78bfa', cursor: 'pointer' }}
                    />
                    Show announcement popup
                  </label>
                </div>
                <textarea 
                  className="admin-input" 
                  value={settingsData.announcement_text || ''} 
                  onChange={(e) => setSettingsData({...settingsData, announcement_text: e.target.value})} 
                  placeholder="Write your announcement here... (will show as a popup in the bottom-left corner)"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <button className="btn btn--primary" style={{ alignSelf: 'flex-start', marginTop: '20px' }} onClick={handleSave}><Save size={16} /> Save All Settings</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {editingId === 'new' && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                  <input className="admin-input" type="text" name="title" placeholder="Title" value={formData.title || ''} onChange={handleChange} />
                  <input className="admin-input" type="text" name="slug" placeholder="URL Slug (e.g. my-awesome-project)" value={formData.slug || ''} onChange={handleChange} />
                  <textarea className="admin-input" name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} />
                  <input className="admin-input" type="text" name="category" placeholder="Category" value={formData.category || ''} onChange={handleChange} />
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thumbnail Image:</label>
                    <div className="file-upload-container">
                      <label className={`file-upload-label ${uploadingField === 'thumbnail' ? 'file-upload-label--active' : ''}`}>
                        {uploadingField === 'thumbnail' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                        <span>{uploadingField === 'thumbnail' ? 'Uploading...' : 'Upload Thumbnail'}</span>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                      </label>
                      <input className="admin-input" type="text" name="thumbnail" placeholder="Or paste image URL directly" value={formData.thumbnail || ''} onChange={handleChange} />
                    </div>
                  </div>
                  
                  {activeTab === 'uploads' && (
                    <input className="admin-input" type="text" name="youtube_url" placeholder="YouTube Video URL (optional)" value={formData.youtube_url || ''} onChange={handleChange} />
                  )}

                  {activeTab === 'packages' && (
                    <>
                      <input className="admin-input" type="number" name="rating" placeholder="Rating (e.g. 4.9)" value={formData.rating || ''} onChange={handleChange} />
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Package File (.zip, .pdf, etc):</label>
                        <div className="file-upload-container">
                          <label className={`file-upload-label ${uploadingField === 'download_url' ? 'file-upload-label--active' : ''}`}>
                            {uploadingField === 'download_url' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                            <span>{uploadingField === 'download_url' ? 'Uploading...' : 'Choose Package File'}</span>
                            <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'download_url')} />
                          </label>
                          
                          {formData.download_url && (
                            <div className="file-preview-strip">
                              <div className="file-preview-name">
                                {formData.download_url.split('/').pop().split('-').slice(0, -1).join('-') || 'Current File'}
                              </div>
                              <div className="file-preview-status">
                                <Check size={14} /> Ready
                              </div>
                            </div>
                          )}
                          <input className="admin-input" type="text" name="download_url" placeholder="Or paste download URL directly" value={formData.download_url || ''} onChange={handleChange} />
                        </div>
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button className="btn btn--primary" onClick={handleSave}><Save size={16} /> Save</button>
                    <button className="btn btn--outline" onClick={handleCancel}><X size={16} /> Cancel</button>
                  </div>
                </div>
              )}

              {items.map(item => (
                <div key={item.id} className="admin-item">
                  {editingId === item.id ? (
                    <div style={{ width: '100%' }}>
                      <input className="admin-input" type="text" name="title" value={formData.title || ''} onChange={handleChange} />
                      <input className="admin-input" type="text" name="slug" placeholder="URL Slug" value={formData.slug || ''} onChange={handleChange} />
                      <textarea className="admin-input" name="description" value={formData.description || ''} onChange={handleChange} />
                      <input className="admin-input" type="text" name="category" value={formData.category || ''} onChange={handleChange} />
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Update Thumbnail:</label>
                            <div className="file-upload-container">
                              <label className={`file-upload-label ${uploadingField === 'thumbnail' ? 'file-upload-label--active' : ''}`}>
                                {uploadingField === 'thumbnail' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                                <span>{uploadingField === 'thumbnail' ? 'Uploading...' : 'Upload New Thumbnail'}</span>
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'thumbnail')} />
                              </label>
                              <input className="admin-input" type="text" name="thumbnail" placeholder="Image URL" value={formData.thumbnail || ''} onChange={handleChange} />
                            </div>
                          </div>
                          
                          {activeTab === 'uploads' && (
                            <input className="admin-input" type="text" name="youtube_url" placeholder="YouTube Video URL" value={formData.youtube_url || ''} onChange={handleChange} />
                          )}

                          {activeTab === 'packages' && (
                            <>
                              <input className="admin-input" type="number" name="rating" placeholder="Rating" value={formData.rating || ''} onChange={handleChange} />
                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Update Package File:</label>
                                <div className="file-upload-container">
                                  <label className={`file-upload-label ${uploadingField === 'download_url' ? 'file-upload-label--active' : ''}`}>
                                    {uploadingField === 'download_url' ? <Loader2 className="spinner" size={18} /> : <Upload size={18} />}
                                    <span>{uploadingField === 'download_url' ? 'Uploading...' : 'Change Package File'}</span>
                                    <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'download_url')} />
                                  </label>
                                  
                                  {formData.download_url && (
                                    <div className="file-preview-strip">
                                      <div className="file-preview-name">
                                        {formData.download_url.split('/').pop().split('-').slice(0, -1).join('-') || 'Current File'}
                                      </div>
                                      <div className="file-preview-status">
                                        <Check size={14} /> Ready
                                      </div>
                                    </div>
                                  )}
                                  <input className="admin-input" type="text" name="download_url" placeholder="Download URL" value={formData.download_url || ''} onChange={handleChange} />
                                </div>
                              </div>
                            </>
                          )}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button className="btn btn--primary" onClick={handleSave}><Save size={16} /> Save</button>
                        <button className="btn btn--outline" onClick={handleCancel}><X size={16} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="admin-item__info">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{item.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>{item.description}</p>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--accent)' }}>
                          <span>{item.category}</span>
                          {item.rating && <span>Rating: {item.rating}</span>}
                        </div>
                      </div>
                      <div className="admin-item__actions">
                        <button className="btn btn--outline" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn btn--outline" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => handleDelete(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {items.length === 0 && editingId !== 'new' && <p style={{ color: 'var(--text-muted)' }}>No items found. Create one!</p>}
            </div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
