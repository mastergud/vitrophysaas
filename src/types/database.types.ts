export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'expert' | 'student'
export type ProjectStatus = 'draft' | 'prepress' | 'production' | 'finished' | 'delivered' | 'archived'
export type BatStatus = 'pending' | 'validated' | 'rejected'
export type ItemComplexity = 'NORMAL' | 'EXPERT'
export type ItemType = 'glass_trophy' | 'medal' | 'cup' | 'plexiglass' | 'other'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          reference: string
          title: string
          client_id: string | null
          status: ProjectStatus
          deadline: string | null
          tray_number: string | null
          bat_file_url: string | null
          bat_status: BatStatus
          bat_version: number
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference: string
          title: string
          client_id?: string | null
          status?: ProjectStatus
          deadline?: string | null
          tray_number?: string | null
          bat_file_url?: string | null
          bat_status?: BatStatus
          bat_version?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference?: string
          title?: string
          client_id?: string | null
          status?: ProjectStatus
          deadline?: string | null
          tray_number?: string | null
          bat_file_url?: string | null
          bat_status?: BatStatus
          bat_version?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_items: {
        Row: {
          id: string
          project_id: string | null
          name: string
          quantity: number
          type: ItemType
          complexity: ItemComplexity
          specs: Json
          is_ordered: boolean
          is_received: boolean
          step_cut: boolean
          step_engrave: boolean
          step_assemble: boolean
          step_quality_control: boolean
          step_pack: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          name: string
          quantity?: number
          type: ItemType
          complexity?: ItemComplexity
          specs?: Json
          is_ordered?: boolean
          is_received?: boolean
          step_cut?: boolean
          step_engrave?: boolean
          step_assemble?: boolean
          step_quality_control?: boolean
          step_pack?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          name?: string
          quantity?: number
          type?: ItemType
          complexity?: ItemComplexity
          specs?: Json
          is_ordered?: boolean
          is_received?: boolean
          step_cut?: boolean
          step_engrave?: boolean
          step_assemble?: boolean
          step_quality_control?: boolean
          step_pack?: boolean
          created_at?: string
        }
      }
      timesheets: {
        Row: {
          id: string
          user_id: string | null
          project_id: string | null
          start_time: string
          end_time: string | null
          description: string | null
          is_edited: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_id?: string | null
          start_time?: string
          end_time?: string | null
          description?: string | null
          is_edited?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          project_id?: string | null
          start_time?: string
          end_time?: string | null
          description?: string | null
          is_edited?: boolean
          created_at?: string
        }
      }
      incidents: {
        Row: {
          id: string
          project_id: string | null
          item_id: string | null
          reported_by: string | null
          description: string
          severity: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          item_id?: string | null
          reported_by?: string | null
          description: string
          severity?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          item_id?: string | null
          reported_by?: string | null
          description?: string
          severity?: string | null
          created_at?: string
        }
      }
      bat_files: {
        Row: {
          id: string
          project_id: string
          version: number
          status: BatStatus
          file_url: string | null
          notes: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          project_id: string
          version: number
          status?: BatStatus
          file_url?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          version?: number
          status?: BatStatus
          file_url?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      settings: {
        Row: {
          key: string
          value: Json | null
          updated_at: string
        }
        Insert: {
          key: string
          value?: Json | null
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      project_status: ProjectStatus
      bat_status: BatStatus
      item_complexity: ItemComplexity
      item_type: ItemType
    }
  }
  operations_private: {
    Tables: {
      project_financials: {
        Row: {
          project_id: string
          total_price_ht: number
          total_cost_ht: number
          margin_ht: number | null
          is_paid: boolean
          updated_at: string
        }
        Insert: {
          project_id: string
          total_price_ht?: number
          total_cost_ht?: number
          margin_ht?: never // Generated always
          is_paid?: boolean
          updated_at?: string
        }
        Update: {
          project_id?: string
          total_price_ht?: number
          total_cost_ht?: number
          margin_ht?: never // Generated always
          is_paid?: boolean
          updated_at?: string
        }
      }
    }
  }
}
