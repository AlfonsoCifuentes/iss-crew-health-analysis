"""
Exploratory Data Analysis Module for ISS Crew Health Data
Provides comprehensive EDA functionality for space medicine research
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from scipy import stats
import logging

logger = logging.getLogger(__name__)

class CrewHealthEDA:
    """Class for exploratory data analysis of crew health data"""
    
    def __init__(self):
        # Set style for matplotlib
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
        
    def generate_summary_statistics(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Generate comprehensive summary statistics
        
        Args:
            df: DataFrame to analyze
            
        Returns:
            DataFrame with summary statistics
        """
        logger.info("Generating summary statistics...")
        
        # Basic statistics
        summary = df.describe()
        
        # Add additional metrics
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        additional_stats = pd.DataFrame(index=numerical_cols)
        
        for col in numerical_cols:
            additional_stats.loc[col, 'missing_count'] = df[col].isnull().sum()
            additional_stats.loc[col, 'missing_percent'] = (df[col].isnull().sum() / len(df)) * 100
            additional_stats.loc[col, 'skewness'] = stats.skew(df[col].dropna())
            additional_stats.loc[col, 'kurtosis'] = stats.kurtosis(df[col].dropna())
        
        return summary, additional_stats
    
    def plot_physiological_distributions(self, df: pd.DataFrame, 
                                       figsize: tuple = (15, 10)) -> None:
        """
        Plot distribution of physiological metrics
        
        Args:
            df: DataFrame containing physiological data
            figsize: Figure size for plots
        """
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        
        if len(numerical_cols) == 0:
            logger.warning("No numerical columns found for distribution plots")
            return
        
        # Calculate number of subplots
        n_cols = 3
        n_rows = (len(numerical_cols) + n_cols - 1) // n_cols
        
        fig, axes = plt.subplots(n_rows, n_cols, figsize=figsize)
        if n_rows == 1:
            axes = axes.reshape(1, -1)
        
        for idx, col in enumerate(numerical_cols):
            row = idx // n_cols
            col_idx = idx % n_cols
            
            # Plot histogram with KDE
            sns.histplot(data=df, x=col, kde=True, ax=axes[row, col_idx])
            axes[row, col_idx].set_title(f'Distribution of {col}')
            axes[row, col_idx].tick_params(axis='x', rotation=45)
        
        # Remove empty subplots
        for idx in range(len(numerical_cols), n_rows * n_cols):
            row = idx // n_cols
            col_idx = idx % n_cols
            fig.delaxes(axes[row, col_idx])
        
        plt.tight_layout()
        plt.show()
    
    def plot_correlation_matrix(self, df: pd.DataFrame, 
                              figsize: tuple = (12, 8)) -> None:
        """
        Plot correlation matrix heatmap
        
        Args:
            df: DataFrame to analyze
            figsize: Figure size for the plot
        """
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        
        if len(numerical_cols) < 2:
            logger.warning("Need at least 2 numerical columns for correlation matrix")
            return
        
        # Calculate correlation matrix
        corr_matrix = df[numerical_cols].corr()
        
        # Create heatmap
        plt.figure(figsize=figsize)
        mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
        
        sns.heatmap(corr_matrix, mask=mask, annot=True, cmap='RdBu_r', 
                   center=0, square=True, linewidths=0.5)
        plt.title('Physiological Metrics Correlation Matrix')
        plt.tight_layout()
        plt.show()
    
    def plot_mission_duration_effects(self, df: pd.DataFrame) -> None:
        """
        Analyze effects of mission duration on physiological metrics
        
        Args:
            df: DataFrame containing mission and health data
        """
        if 'mission_duration_days' not in df.columns:
            logger.warning("Mission duration data not found")
            return
        
        # Find physiological change columns
        change_cols = [col for col in df.columns if 'change' in col.lower()]
        
        if not change_cols:
            logger.warning("No physiological change columns found")
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.flatten()
        
        for idx, col in enumerate(change_cols[:4]):  # Plot first 4 metrics
            if idx < len(axes):
                # Scatter plot with regression line
                sns.scatterplot(data=df, x='mission_duration_days', y=col, 
                               ax=axes[idx], alpha=0.6)
                sns.regplot(data=df, x='mission_duration_days', y=col, 
                           ax=axes[idx], scatter=False, color='red')
                
                # Calculate correlation
                correlation = df['mission_duration_days'].corr(df[col])
                axes[idx].set_title(f'{col} vs Mission Duration\nCorrelation: {correlation:.3f}')
        
        # Remove unused subplots
        for idx in range(len(change_cols), len(axes)):
            fig.delaxes(axes[idx])
        
        plt.tight_layout()
        plt.show()
    
    def plot_interactive_3d_analysis(self, df: pd.DataFrame) -> None:
        """
        Create interactive 3D visualization of crew health metrics
        
        Args:
            df: DataFrame containing health metrics
        """
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        
        if len(numerical_cols) < 3:
            logger.warning("Need at least 3 numerical columns for 3D plot")
            return
        
        # Select first 3 numerical columns for 3D plot
        x_col, y_col, z_col = numerical_cols[:3]
        
        fig = go.Figure(data=[go.Scatter3d(
            x=df[x_col],
            y=df[y_col],
            z=df[z_col],
            mode='markers',
            marker=dict(
                size=5,
                color=df[z_col] if z_col in df.columns else 'blue',
                colorscale='Viridis',
                opacity=0.6,
                showscale=True
            ),
            text=[f"Record {i}" for i in range(len(df))],
            hovertemplate=f"<b>{x_col}</b>: %{{x}}<br>" +
                         f"<b>{y_col}</b>: %{{y}}<br>" +
                         f"<b>{z_col}</b>: %{{z}}<br>" +
                         "<extra></extra>"
        )])
        
        fig.update_layout(
            title='3D Analysis of Crew Health Metrics',
            scene=dict(
                xaxis_title=x_col,
                yaxis_title=y_col,
                zaxis_title=z_col
            ),
            width=800,
            height=600
        )
        
        fig.show()
    
    def analyze_outliers(self, df: pd.DataFrame) -> None:
        """
        Analyze and visualize outliers in the data
        
        Args:
            df: DataFrame to analyze
        """
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        
        if len(numerical_cols) == 0:
            logger.warning("No numerical columns found for outlier analysis")
            return
        
        # Box plots for outlier detection
        n_cols = 2
        n_rows = (len(numerical_cols) + n_cols - 1) // n_cols
        
        fig, axes = plt.subplots(n_rows, n_cols, figsize=(12, n_rows * 4))
        if n_rows == 1:
            axes = axes.reshape(1, -1)
        
        for idx, col in enumerate(numerical_cols):
            row = idx // n_cols
            col_idx = idx % n_cols
            
            sns.boxplot(data=df, y=col, ax=axes[row, col_idx])
            axes[row, col_idx].set_title(f'Outliers in {col}')
        
        # Remove empty subplots
        for idx in range(len(numerical_cols), n_rows * n_cols):
            row = idx // n_cols
            col_idx = idx % n_cols
            fig.delaxes(axes[row, col_idx])
        
        plt.tight_layout()
        plt.show()
    
    def generate_comprehensive_report(self, df: pd.DataFrame) -> str:
        """
        Generate a comprehensive EDA report
        
        Args:
            df: DataFrame to analyze
            
        Returns:
            String containing the report
        """
        logger.info("Generating comprehensive EDA report...")
        
        report = []
        report.append("=" * 60)
        report.append("ISS CREW HEALTH DATA - EXPLORATORY DATA ANALYSIS REPORT")
        report.append("=" * 60)
        
        # Basic info
        report.append(f"\nDATASET OVERVIEW:")
        report.append(f"- Total records: {len(df)}")
        report.append(f"- Total features: {len(df.columns)}")
        report.append(f"- Numerical features: {len(df.select_dtypes(include=[np.number]).columns)}")
        report.append(f"- Categorical features: {len(df.select_dtypes(include=['object']).columns)}")
        
        # Missing data summary
        missing_data = df.isnull().sum()
        if missing_data.sum() > 0:
            report.append(f"\nMISSING DATA:")
            for col, missing_count in missing_data.items():
                if missing_count > 0:
                    missing_pct = (missing_count / len(df)) * 100
                    report.append(f"- {col}: {missing_count} ({missing_pct:.1f}%)")
        
        # Key findings
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        if len(numerical_cols) > 0:
            report.append(f"\nKEY STATISTICAL INSIGHTS:")
            for col in numerical_cols:
                if not df[col].empty:
                    mean_val = df[col].mean()
                    std_val = df[col].std()
                    report.append(f"- {col}: Mean = {mean_val:.2f}, Std = {std_val:.2f}")
        
        report.append("\n" + "=" * 60)
        
        return "\n".join(report)
    
    def run_complete_eda(self, df: pd.DataFrame) -> None:
        """
        Run complete exploratory data analysis
        
        Args:
            df: DataFrame to analyze
        """
        logger.info("Starting comprehensive EDA...")
        
        # Generate and print report
        report = self.generate_comprehensive_report(df)
        print(report)
        
        # Generate visualizations
        print("\nGenerating visualizations...")
        
        try:
            self.plot_physiological_distributions(df)
        except Exception as e:
            logger.error(f"Error plotting distributions: {e}")
        
        try:
            self.plot_correlation_matrix(df)
        except Exception as e:
            logger.error(f"Error plotting correlation matrix: {e}")
        
        try:
            self.plot_mission_duration_effects(df)
        except Exception as e:
            logger.error(f"Error plotting mission duration effects: {e}")
        
        try:
            self.analyze_outliers(df)
        except Exception as e:
            logger.error(f"Error analyzing outliers: {e}")
        
        logger.info("EDA completed successfully")

if __name__ == "__main__":
    # Example usage
    eda = CrewHealthEDA()
    
    # Create sample data for demonstration
    np.random.seed(42)
    sample_data = pd.DataFrame({
        'mission_duration_days': np.random.normal(200, 50, 100),
        'bone_density_change': np.random.normal(-6, 2, 100),
        'muscle_mass_change': np.random.normal(-15, 5, 100),
        'cardiovascular_change': np.random.normal(-3, 1.5, 100),
        'crew_age': np.random.randint(25, 50, 100)
    })
    
    eda.run_complete_eda(sample_data)
